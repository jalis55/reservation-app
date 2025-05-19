from django.urls import path
from bookingapp.views import CreateBookingView,BookingListView,AllUserBookingListView,CancelBookingView

urlpatterns = [
    path('create/', CreateBookingView.as_view(), name='create-booking'),
    path('reserve-dates/',BookingListView.as_view(),name='reserve-dates'),
    path('all/user/reserve-dates/<str:from_dt>/<str:to_dt>/', AllUserBookingListView.as_view(), name='all-user-reserve-dates'),
    path('cancel-booking/<str:booking_date>/',CancelBookingView.as_view(),name='cancel-booking'),
    

]