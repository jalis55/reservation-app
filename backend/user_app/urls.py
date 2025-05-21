from django.urls import path
from .views import (
    OrganizationListView,UserRegistrationView)


urlpatterns = [
    path('organizations/', OrganizationListView.as_view(), name='organization-list'),
    path('user-registration/', UserRegistrationView.as_view(), name='user-registration'),
]