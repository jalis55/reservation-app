from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView,ListAPIView,GenericAPIView
from bookingapp.serializers import CreateBookingSerializer,RetriveBookingSerializer
from rest_framework.response import Response
from bookingapp.models import Booking
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
# Create your views here.


from rest_framework.response import Response
from rest_framework import status

class CreateBookingView(ListCreateAPIView):
    serializer_class = CreateBookingSerializer
    permission_classes = [IsAuthenticated]
    queryset = Booking.objects.all()

    def create(self, request, *args, **kwargs):
        # Handle single booking
        if isinstance(request.data, dict):
            return super().create(request, *args, **kwargs)
        
        # Handle multiple bookings
        elif isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
        else:
            return Response(
                {"error": "Invalid data. Expected a dictionary or list."},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_create(self, serializer):
        # Associate the booking with the authenticated user
        if isinstance(serializer, list):
            for item in serializer:
                item.save(user=self.request.user)
        else:
            serializer.save(user=self.request.user)

class BookingListView(ListAPIView):
    serializer_class= CreateBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
    
class AllUserBookingListView(GenericAPIView):
    serializer_class = RetriveBookingSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        from_dt = self.kwargs.get('from_dt')
        to_dt = self.kwargs.get('to_dt')
        return Booking.objects.filter(booking_date__range=[from_dt, to_dt])

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



class CancelBookingView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can access
    
    def delete(self, request, booking_date):
        try:
            # Find the booking for this user on the specified date
            booking = Booking.objects.get(
                user=request.user,
                booking_date=booking_date
            )
            booking.delete()
            return Response(
                {"message": "Booking successfully cancelled."},
                status=status.HTTP_204_NO_CONTENT
            )
        except Booking.DoesNotExist:
            return Response(
                {"error": "No booking found for this date."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )