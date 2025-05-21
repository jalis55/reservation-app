from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,AllowAny
from user_app.serializers import OrgazationSerializer,UserSerializer
from .models import Organization


class OrganizationListView(generics.ListAPIView):
    """
    View to list all organizations.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = OrgazationSerializer
    queryset = Organization.objects.all()



class UserRegistrationView(generics.CreateAPIView):
    """
    View to register a new user.
    """
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    queryset = Organization.objects.all()

