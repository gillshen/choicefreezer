from django.urls import path

from user.views import UserProfileUpdateView, UserProfileListView

from core.views import (
    StudentCreateView,
    StudentUpdateDeleteView,
    StudentListView,
    ContractCreateView,
    ContractUpdateDeleteView,
    ServiceCreateView,
    ServiceUpdateDeleteView,
    ApplicationCreateView,
    ApplicationUpdateDeleteView,
    ApplicationListView,
    MajorChoiceCreateView,
    MajorChoiceUpdateDeleteView,
    ApplicationLogCreateView,
    ApplicationLogUpdateDeleteView,
)

from target.views import (
    SchoolCreateView,
    SchoolUpdateView,
    SchoolListView,
    SchoolRankingCreateView,
    SchoolRankingUpdateDeleteView,
    ProgramCreateView,
    ProgramUpdateDeleteView,
    ProgramListView,
    TargetCreateView,
    TargetUpdateDeleteView,
    TargetListView,
    TargetRequirementsCreateView,
    TargetRequirementsUpdateDeleteView,
    SubTargetCreateView,
    SubTargetUpdateDeleteView,
)

# user.views
urlpatterns = [
    path("cf/<int:pk>/update/", UserProfileUpdateView.as_view()),
    path("cf/", UserProfileListView.as_view()),
]

# core.views

# Student views
urlpatterns += [
    path("students/new/", StudentCreateView.as_view(), name="create_student"),
    path("students/<int:pk>/update/", StudentUpdateDeleteView.as_view()),
    path("students/<int:pk>/delete/", StudentUpdateDeleteView.as_view()),
    path("students/", StudentListView.as_view()),
]

# Contract views
urlpatterns += [
    path("contracts/new/", ContractCreateView.as_view()),
    path("contracts/<int:pk>/update/", ContractUpdateDeleteView.as_view()),
    path("contracts/<int:pk>/delete/", ContractUpdateDeleteView.as_view()),
]

# Service views
urlpatterns += [
    path("services/new/", ServiceCreateView.as_view()),
    path("services/<int:pk>/update/", ServiceUpdateDeleteView.as_view()),
    path("services/<int:pk>/delete/", ServiceUpdateDeleteView.as_view()),
]

# Application views
urlpatterns += [
    path("applications/new/", ApplicationCreateView.as_view()),
    path("applications/<int:pk>/update/", ApplicationUpdateDeleteView.as_view()),
    path("applications/<int:pk>/delete/", ApplicationUpdateDeleteView.as_view()),
    path("applications/", ApplicationListView.as_view()),
]

# MajorChoice views
urlpatterns += [
    path("major_choices/new/", MajorChoiceCreateView.as_view()),
    path("major_choices/<int:pk>/update/", MajorChoiceUpdateDeleteView.as_view()),
    path("major_choices/<int:pk>/delete/", MajorChoiceUpdateDeleteView.as_view()),
]

# ApplicationLog views
urlpatterns += [
    path("application_logs/new/", ApplicationLogCreateView.as_view()),
    path("application_logs/<int:pk>/update/", ApplicationLogUpdateDeleteView.as_view()),
    path("application_logs/<int:pk>/delete/", ApplicationLogUpdateDeleteView.as_view()),
]

# target.views

# School views
urlpatterns += [
    path("schools/new/", SchoolCreateView.as_view()),
    path("schools/<int:pk>/update/", SchoolUpdateView.as_view()),
    path("schools/", SchoolListView.as_view()),
]

# SchoolRanking views
urlpatterns += [
    path("school_rankings/new/", SchoolRankingCreateView.as_view()),
    path("school_rankings/<int:pk>/update/", SchoolRankingUpdateDeleteView.as_view()),
    path("school_rankings/<int:pk>/delete/", SchoolRankingUpdateDeleteView.as_view()),
]

# Program views
urlpatterns += [
    path("programs/new/", ProgramCreateView.as_view()),
    path("programs/<int:pk>/update/", ProgramUpdateDeleteView.as_view()),
    path("programs/<int:pk>/delete/", ProgramUpdateDeleteView.as_view()),
    path("programs/", ProgramListView.as_view()),
]

# Target views
urlpatterns += [
    path("targets/new/", TargetCreateView.as_view()),
    path("targets/<int:pk>/update/", TargetUpdateDeleteView.as_view()),
    path("targets/<int:pk>/delete/", TargetUpdateDeleteView.as_view()),
    path("targets/", TargetListView.as_view()),
]

# TargetRequirements views
urlpatterns += [
    path("how_to_apply/new/", TargetRequirementsCreateView.as_view()),
    path("how_to_apply/<int:pk>/update/", TargetRequirementsUpdateDeleteView.as_view()),
    path("how_to_apply/<int:pk>/delete/", TargetRequirementsUpdateDeleteView.as_view()),
]

# SubTarget views
urlpatterns += [
    path("subtargets/new/", SubTargetCreateView.as_view()),
    path("subtargets/<int:pk>/update/", SubTargetUpdateDeleteView.as_view()),
    path("subtargets/<int:pk>/delete/", SubTargetUpdateDeleteView.as_view()),
]
