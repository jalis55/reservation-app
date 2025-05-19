from rest_framework import generics, permissions
from user_app.serializers import OrgazationSerializer
from .models import Organization


class OrganizationListView(generics.ListAPIView):
    """
    View to list all organizations.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrgazationSerializer
    queryset = Organization.objects.all()




