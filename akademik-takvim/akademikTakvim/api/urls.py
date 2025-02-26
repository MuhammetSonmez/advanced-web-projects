from django.urls import path
from .views import (
    TakvimListCreateView,
    TakvimDetailView,
    EventListCreateView,
    EventDetailView,
    LoginView,
    AddUserView
)

urlpatterns = [
    path('api/takvim/', TakvimListCreateView.as_view(), name='takvim-list-create'),
    path('api/takvim/<int:pk>/', TakvimDetailView.as_view(), name='takvim-detail'),
    path('api/events/', EventListCreateView.as_view(), name='event-list-create'),
    path('api/events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('api/login/', LoginView.as_view(), name='login'),
   path('api/register/', AddUserView.as_view(), name='register'),
]
