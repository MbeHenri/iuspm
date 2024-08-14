from django.urls import path, include
from rest_framework import routers

app_name = "planning"

# router of view set of API view
router = routers.SimpleRouter()

# register of view set of API view
# router.register("server", ServerViewset, basename="server")

urlpatterns = [
    path(f"{app_name}", include(router.urls)),
]
