from rest_framework.serializers import ModelSerializer
from bookingapp.models import Booking
from user_app.models import Department
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer






User=get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Get the default token from the parent class
        token = super().get_token(user)

        # Add custom claims to the token
        token['user_id'] = user.id
        token['email'] = user.email
        token['name'] = user.name
        token['is_admin'] = user.is_staff 
        token['is_super_admin']=user.is_superuser
        return token
class DepartmentSerializer(ModelSerializer):
    class Meta:
        model = Department
        fields = ['name']  # or include more fields if needed

class UserSerializer(ModelSerializer):
    department = DepartmentSerializer()  # Nested serializer
    
    class Meta:
        model = User
        fields = ['email', 'name', 'department']



class CreateBookingSerializer(ModelSerializer):
    class Meta:
        model=Booking
        fields=['booking_date']

class RetriveBookingSerializer(ModelSerializer):
    user=UserSerializer()
    class Meta:
        model=Booking
        fields=['user','booking_date']
