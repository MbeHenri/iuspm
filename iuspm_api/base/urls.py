from django.urls import path, include
from rest_framework import routers
from base.views import StudentViewSet

app_name = "base"

# router of view set of API view
router = routers.SimpleRouter()

# register of view set of API view
router.register("student", StudentViewSet, basename="student")

urlpatterns = [
    path("api/v1/", include(router.urls)),
]
