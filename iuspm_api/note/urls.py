from django.urls import path
from . import views

urlpatterns = [
    path("grep", views.test),
]
