from django.contrib import admin
from .models import CustomUser,Organization, Department

admin.site.register(CustomUser)
admin.site.register(Organization)
admin.site.register(Department)
