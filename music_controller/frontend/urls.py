from django.urls import path
from .views import index

# For using redirect('frontend:') inside the spotify/views.py
app_name = 'frontend'

urlpatterns = [
    path('', index, name=''), # name='' - For using redirect('frontend:') inside the spotify/views.py
    path('join', index),
    path('create', index),
    path('room/<str:roomCode>', index),
]