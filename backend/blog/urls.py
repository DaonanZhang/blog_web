from django.urls import path
from . import views

urlpatterns = [
    path("blogs/", views.BlogListCreateView.as_view(), name="blog_list"),
    path("blogs/<int:pk>/", views.BlogDetailView.as_view(), name="blog_detail"),
    path("blogs/<int:blog_id>/comments/", views.CommentListCreateView.as_view(), name="comment_create"),
    path("blogs/<int:blog_id>/comments/<int:comment_id>/", views.CommentDetailView.as_view(), name="comment_detail"),
]