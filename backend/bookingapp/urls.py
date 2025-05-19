from django.urls import path
from bookingapp.views import CreateBookingView,BookingListView,CancelBookingView,BookingReportView

urlpatterns = [
    path('create/', CreateBookingView.as_view(), name='create-booking'),
    path('reserve-dates/',BookingListView.as_view(),name='reserve-dates'),
    path('org/reports/<str:from_dt>/<str:to_dt>/<int:organization>/', BookingReportView.as_view(), name='booking-report'),
    path('cancel-booking/<str:booking_date>/',CancelBookingView.as_view(),name='cancel-booking'),
    

]