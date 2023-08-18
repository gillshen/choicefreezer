from django.urls import path

from user.views import (
    CfUserCreateView,
    CfUserRetrieveView,
    CfUserUpdateView,
    CfUserListView,
)

from core.views import (
    CfProductCreateView,
    CfProductRetrieveView,
    CfProductUpdateDeleteView,
    CfProductListView,
    StudentCreateView,
    StudentRetrieveView,
    StudentUpdateDeleteView,
    StudentListView,
    ContractCreateView,
    ContractUpdateDeleteView,
    ContractListView,
    ServiceCreateView,
    ServiceUpdateDeleteView,
    ApplicationCreateView,
    ApplicationRetrieveView,
    ApplicationUpdateDeleteView,
    ApplicationListView,
    MajorChoiceCreateView,
    MajorChoiceUpdateDeleteView,
    ApplicationLogCreateView,
    ApplicationLogUpdateDeleteView,
    ApplicationLogListView,
)

from target.views import (
    SchoolCreateView,
    SchoolRetrieveView,
    SchoolUpdateView,
    SchoolListView,
    SchoolRankingCreateView,
    SchoolRankingUpdateDeleteView,
    ProgramCreateView,
    ProgramRetrieveView,
    ProgramUpdateDeleteView,
    ProgramListView,
    TargetCreateView,
    TargetRetrieveView,
    TargetUpdateDeleteView,
    TargetListView,
    TargetRequirementsCreateView,
    TargetRequirementsRetrieveView,
    TargetRequirementsUpdateDeleteView,
    SubTargetCreateView,
    SubTargetUpdateDeleteView,
    SubTargetListView,
)

from student.views import (
    StudentLogCreateView,
    StudentLogUpdateDeleteView,
    StudentLogListView,
    EnrollmentCreateView,
    EnrollmentUpdateDeleteView,
    EnrollmentListView,
    GPA_CreateView,
    GPA_UpdateDeleteView,
    GPA_ListView,
    ClassRankCreateView,
    ClassRankUpdateDeleteView,
    ClassRankListView,
    TOEFL_CreateView,
    TOEFL_UpdateDeleteView,
    TOEFL_ListView,
    IELTS_CreateView,
    IELTS_UpdateDeleteView,
    IELTS_ListView,
    DET_CreateView,
    DET_UpdateDeleteView,
    DET_ListView,
    SAT_CreateView,
    SAT_UpdateDeleteView,
    SAT_ListView,
    ACT_CreateView,
    ACT_UpdateDeleteView,
    ACT_ListView,
    AP_CreateView,
    AP_UpdateDeleteView,
    AP_ListView,
    GRE_CreateView,
    GRE_UpdateDeleteView,
    GRE_ListView,
    GMAT_CreateView,
    GMAT_UpdateDeleteView,
    GMAT_ListView,
)

# user.views
urlpatterns = [
    path("cf/__register/", CfUserCreateView.as_view()),
    path("cf/<str:username>/", CfUserRetrieveView.as_view()),
    path("cf/<str:username>/update/", CfUserUpdateView.as_view()),
    path("cf/", CfUserListView.as_view()),
]

# core.views

# CfProduct views
urlpatterns += [
    path("products/new/", CfProductCreateView.as_view()),
    path("products/<int:pk>/", CfProductRetrieveView.as_view()),
    path("products/<int:pk>/update/", CfProductUpdateDeleteView.as_view()),
    path("products/<int:pk>/delete/", CfProductUpdateDeleteView.as_view()),
    path("products/", CfProductListView.as_view()),
]

# Student views
urlpatterns += [
    path("students/new/", StudentCreateView.as_view()),
    path("students/<int:pk>/", StudentRetrieveView.as_view()),
    path("students/<int:pk>/update/", StudentUpdateDeleteView.as_view()),
    path("students/<int:pk>/delete/", StudentUpdateDeleteView.as_view()),
    path("students/", StudentListView.as_view()),
]

# Contract views
urlpatterns += [
    path("contracts/new/", ContractCreateView.as_view()),
    path("contracts/<int:pk>/update/", ContractUpdateDeleteView.as_view()),
    path("contracts/<int:pk>/delete/", ContractUpdateDeleteView.as_view()),
    # contracts involving a student
    path("contracts/", ContractListView.as_view()),
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
    path("applications/<int:pk>/", ApplicationRetrieveView.as_view()),
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
    path("application_logs/", ApplicationLogListView.as_view()),
]

# target.views

# School views
urlpatterns += [
    path("schools/new/", SchoolCreateView.as_view()),
    path("schools/<int:pk>/", SchoolRetrieveView.as_view()),
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
    path("programs/<int:pk>/", ProgramRetrieveView.as_view()),
    path("programs/<int:pk>/update/", ProgramUpdateDeleteView.as_view()),
    path("programs/<int:pk>/delete/", ProgramUpdateDeleteView.as_view()),
    path("programs/", ProgramListView.as_view()),
]

# Target views
urlpatterns += [
    path("targets/new/", TargetCreateView.as_view()),
    path("targets/<int:pk>/", TargetRetrieveView.as_view()),
    path("targets/<int:pk>/update/", TargetUpdateDeleteView.as_view()),
    path("targets/<int:pk>/delete/", TargetUpdateDeleteView.as_view()),
    path("targets/", TargetListView.as_view()),
]

# TargetRequirements views
urlpatterns += [
    path("reqs/new/", TargetRequirementsCreateView.as_view()),
    path("reqs/<int:target>/", TargetRequirementsRetrieveView.as_view()),
    path("reqs/<int:target>/update/", TargetRequirementsUpdateDeleteView.as_view()),
    path("reqs/<int:target>/delete/", TargetRequirementsUpdateDeleteView.as_view()),
]

# SubTarget views
urlpatterns += [
    path("subtargets/new/", SubTargetCreateView.as_view()),
    path("subtargets/<int:pk>/update/", SubTargetUpdateDeleteView.as_view()),
    path("subtargets/<int:pk>/delete/", SubTargetUpdateDeleteView.as_view()),
    path("subtargets/", SubTargetListView.as_view()),
]

# student.views

# StudentLog views
urlpatterns += [
    path("s.logs/new/", StudentLogCreateView.as_view()),
    path("s.logs/<int:pk>/update/", StudentLogUpdateDeleteView.as_view()),
    path("s.logs/<int:pk>/delete/", StudentLogUpdateDeleteView.as_view()),
    path("s.logs/", StudentLogListView.as_view()),
]

# Enrollment views
urlpatterns += [
    path("s.enrollments/new/", EnrollmentCreateView.as_view()),
    path("s.enrollments/<int:pk>/update/", EnrollmentUpdateDeleteView.as_view()),
    path("s.enrollments/<int:pk>/delete/", EnrollmentUpdateDeleteView.as_view()),
    path("s.enrollments/", EnrollmentListView.as_view()),
]

# GPA views
urlpatterns += [
    path("s.gpa/new/", GPA_CreateView.as_view()),
    path("s.gpa/<int:pk>/update/", GPA_UpdateDeleteView.as_view()),
    path("s.gpa/<int:pk>/delete/", GPA_UpdateDeleteView.as_view()),
    path("s.gpa/", GPA_ListView.as_view()),
]

# ClassRank views
urlpatterns += [
    path("s.class_ranks/new/", ClassRankCreateView.as_view()),
    path("s.class_ranks/<int:pk>/update/", ClassRankUpdateDeleteView.as_view()),
    path("s.class_ranks/<int:pk>/delete/", ClassRankUpdateDeleteView.as_view()),
    path("s.class_ranks/", ClassRankListView.as_view()),
]

# TOEFL views
urlpatterns += [
    path("s.toefl/new/", TOEFL_CreateView.as_view()),
    path("s.toefl/<int:pk>/update/", TOEFL_UpdateDeleteView.as_view()),
    path("s.toefl/<int:pk>/delete/", TOEFL_UpdateDeleteView.as_view()),
    path("s.toefl/", TOEFL_ListView.as_view()),
]

# IELTS views
urlpatterns += [
    path("s.ielts/new/", IELTS_CreateView.as_view()),
    path("s.ielts/<int:pk>/update/", IELTS_UpdateDeleteView.as_view()),
    path("s.ielts/<int:pk>/delete/", IELTS_UpdateDeleteView.as_view()),
    path("s.ielts/", IELTS_ListView.as_view()),
]

# DET views
urlpatterns += [
    path("s.det/new/", DET_CreateView.as_view()),
    path("s.det/<int:pk>/update/", DET_UpdateDeleteView.as_view()),
    path("s.det/<int:pk>/delete/", DET_UpdateDeleteView.as_view()),
    path("s.det/", DET_ListView.as_view()),
]

# SAT views
urlpatterns += [
    path("s.sat/new/", SAT_CreateView.as_view()),
    path("s.sat/<int:pk>/update/", SAT_UpdateDeleteView.as_view()),
    path("s.sat/<int:pk>/delete/", SAT_UpdateDeleteView.as_view()),
    path("s.sat/", SAT_ListView.as_view()),
]

# ACT views
urlpatterns += [
    path("s.act/new/", ACT_CreateView.as_view()),
    path("s.act/<int:pk>/update/", ACT_UpdateDeleteView.as_view()),
    path("s.act/<int:pk>/delete/", ACT_UpdateDeleteView.as_view()),
    path("s.act/", ACT_ListView.as_view()),
]

# AP views
urlpatterns += [
    path("s.ap/new/", AP_CreateView.as_view()),
    path("s.ap/<int:pk>/update/", AP_UpdateDeleteView.as_view()),
    path("s.ap/<int:pk>/delete/", AP_UpdateDeleteView.as_view()),
    path("s.ap/", AP_ListView.as_view()),
]

# GRE views
urlpatterns += [
    path("s.gre/new/", GRE_CreateView.as_view()),
    path("s.gre/<int:pk>/update/", GRE_UpdateDeleteView.as_view()),
    path("s.gre/<int:pk>/delete/", GRE_UpdateDeleteView.as_view()),
    path("s.gre/", GRE_ListView.as_view()),
]

# GMAT views
urlpatterns += [
    path("s.gmat/new/", GMAT_CreateView.as_view()),
    path("s.gmat/<int:pk>/update/", GMAT_UpdateDeleteView.as_view()),
    path("s.gmat/<int:pk>/delete/", GMAT_UpdateDeleteView.as_view()),
    path("s.gmat/", GMAT_ListView.as_view()),
]
