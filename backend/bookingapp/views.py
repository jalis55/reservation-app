from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView,ListAPIView,GenericAPIView
from bookingapp.serializers import CreateBookingSerializer,RetriveBookingSerializer
from rest_framework.response import Response
from bookingapp.models import Booking
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAdminUser
import datetime
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
    


class BookingReportView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        try:
            # Get parameters from URL (if using path params) or request.GET (if using query params)
            from_dt = self.kwargs.get('from_dt')  # or request.GET.get('from_dt')
            to_dt = self.kwargs.get('to_dt')      # or request.GET.get('to_dt')
            organization = self.kwargs.get('organization')  # or request.GET.get('organization')

            # Validate parameters
            if not all([from_dt, to_dt, organization]):
                return Response({"error": "Missing required parameters"}, status=400)


            # Validate date range
            if from_dt > to_dt:
                return Response({"error": "From date cannot be after to date"}, status=400)

            # Query bookings
            if from_dt == to_dt:
                bookings = Booking.objects.filter(
                    booking_date=from_dt,
                    user__organization=organization
                )
            else:
                bookings = Booking.objects.filter(
                    booking_date__range=[from_dt, to_dt],
                    user__organization=organization
                )

            serializer = RetriveBookingSerializer(bookings, many=True)
            return Response(serializer.data)

        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


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