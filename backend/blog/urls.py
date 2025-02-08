from django.urls import path
from . import views

urlpatterns = [
    path("blogss/", views.BlogListCreateView.as_view(), name="blog_list"),
    path("blogss/<int:pk>/", views.BlogDetailView.as_view(), name="blog_detail"),
    path("blogss/<int:blog_id>/comments/", views.CommentListCreateView.as_view(), name="comment_create"),
    path("blogss/<int:blog_id>/comments/<int:comment_id>/", views.CommentDetailView.as_view(), name="comment_detail"),
]