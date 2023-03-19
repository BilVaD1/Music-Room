from django.shortcuts import render
from rest_framework import generics, status
from .serializer import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# Create your views here.
class RoomView(generics.ListAPIView):
    # In Django, a queryset is used to represent a collection of objects from a particular model. It allows you to retrieve, filter, order, and manipulate data from the database efficiently.
    queryset = Room.objects.all()
    # The serializer_class attribute specifies the serializer class that should be used to convert the Room objects retrieved from the database into a JSON-serializable format that can be returned in the API response. 
    serializer_class = RoomSerializer

class JoinRoom(APIView):
    # lookup_url_kwarg is a class-level attribute that specifies the name of the URL keyword argument to use when looking up the Room code from the POST request data.
    lookup_url_kwarg = 'code'

    # The post method handles POST requests to the API view. It first checks if the user has an existing session, and creates one if not using self.request.session.exists() and self.request.session.create().
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # It then retrieves the Room code from the POST request data using request.data.get(self.lookup_url_kwarg), which uses the lookup_url_kwarg attribute to get the value of the code keyword argument from the request data.
        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            # Searching for room where code from url is matching with code of room
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                # self.request.session['room_code'] = code it's like browser.smth = 'smth' in JS.
                '''self.request.session is a dictionary-like object that represents the current session for the user making the request. Sessions are a way to store data that persists across multiple requests made by the same client.

                In the line self.request.session['room_code'] = code, we're setting the value of the 'room_code' key in the user's session to the value of the code variable. This is done to indicate that the user has successfully joined the Room with the given code.

                Later on, this value can be retrieved from the session using self.request.session.get('room_code') to check if the user is currently in a Room. If the value is not None, it means that the user is currently in a Room and the value of the 'room_code' key is the code of the Room they have joined.'''

                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid room code'}, status=status.HTTP_400_BAD_REQUEST)
            
        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)

class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'
    
    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                # If a matching Room object is found, it serializes the Room object into a JSON format using RoomSerializer(room[0]).data. It then adds an is_host key to the JSON data, which is True if the current user is the host of the Room (determined by checking if the user's session key matches the Room object's host attribute), and False otherwise.
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad Request': 'Code parameter not found in Request'}, status=status.HTTP_400_BAD_REQUEST)
    
class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)
    
class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()
        
        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)


# Post
class CreateRoomView(APIView):
    # Json fields from model
    serializer_class = CreateRoomSerializer

    # Post method
    def post(self, request, format=None):
        # Create a new seesion if session wasn't created
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # Creates an instance of the CreateRoomSerializer class using the incoming request data.
        serializer = self.serializer_class(data=request.data)
        # If the serializer data is valid, the view extracts the guest_can_pause and votes_to_skip fields from the validated data, as well as the session key from the request.
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key

            # If room wasn't created create a room, else get already existed fields
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
                # Return JSON and Status Code to client
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code

                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
                # RoomSerializer(room).data - returrn JSON; status=status.HTTP_201_CREATED - sent the status of POST

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
    
        '''This code "CreateRoomView(APIView)" defines a CreateRoomView API view in Django. It handles HTTP POST requests and is responsible for creating a new room based on the data provided in the request.

        The view uses a serializer class CreateRoomSerializer to deserialize the incoming request data and validate it against the model fields. The serializer is defined as a class variable serializer_class in the view.

        In the post method, the view first checks if a session has been created or not, and creates one if it hasn't. It then creates an instance of the CreateRoomSerializer class using the incoming request data. If the serializer data is valid, the view extracts the guest_can_pause and votes_to_skip fields from the validated data, as well as the session key from the request.

        The view then checks if a room already exists for the given session key. If a room exists, the view updates the existing room object with the new guest_can_pause and votes_to_skip values and saves the changes to the database. If a room does not exist, the view creates a new Room object and saves it to the database.

        Finally, the view returns a JSON response containing the serialized data for the created or updated room object, along with an appropriate HTTP status code (either HTTP_200_OK for updates or HTTP_201_CREATED for new creations). If the incoming request data fails validation, the view returns a HTTP_400_BAD_REQUEST response along with an error message.'''

class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        # Create the session if not exists
        if not self.request.session.exists(self.request.session.session_key):
                self.request.session.create()

        # Create a serializer instance using the data from the frontend
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # Grab information from the frontend (from created serializer instance with infrotmation from frontend "serializer")
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')

            # Searching for the room
            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)
            
            room = queryset[0]
            #Checking if the user is host
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({'msg': 'You are not the host of this room'}, status=status.HTTP_403_FORBIDDEN)
            
            # Save data in the db
            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
    
        '''Apart from that, the code looks good and seems to be implementing an API view to update the properties of a Room model instance. The view first creates a session if it does not exist, then uses the UpdateRoomSerializer to deserialize and validate the incoming data. If the data is valid, it extracts the relevant properties from the serializer data, searches for the room with the given code, and checks if the user making the request is the host of the room. If the user is the host, the view updates the Room instance with the new properties and returns a serialized version of the updated Room object along with an HTTP 200 OK response. Otherwise, it returns an HTTP 403 FORBIDDEN response indicating that the user is not authorized to update the room.'''