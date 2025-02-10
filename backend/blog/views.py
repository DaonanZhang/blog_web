from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .models import Blog, Comment
from .serializers import BlogSerializer, CommentSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .pagination import CustomPagination
from django.shortcuts import get_object_or_404

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    
class BlogListCreateView(generics.ListCreateAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    pagination_class.page_size = 2

    def get_queryset(self):
        return Blog.objects.all().order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


    
class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_update(self, serializer):
        if self.get_object.author != self.request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            serializer.save(author=self.request.user)
    
    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            return super().perform_destroy(instance)
        

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    pagination_class.page_size = 2
    
    def get_queryset(self):
        blog = get_object_or_404(Blog, pk=self.kwargs['blog_id'])
        return blog.comments.all().order_by('-created_at')
    
    def perform_create(self, serializer):
        blog = get_object_or_404(Blog, pk=self.kwargs['blog_id'])
        serializer.save(author=self.request.user, blog=blog)
        

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_update(self, serializer):
        comment = self.get_object()
        if comment.author != self.request.user:
            return Response({"detail": ""}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            return Response({"detail": ""}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()


# class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = CommentSerializer

#     def get_queryset(self):
#         return Comment.objects.filter(blog_id=self.kwargs['blog_id'])

#     def get_object(self):
#         blog_id = self.kwargs['blog_id']
#         comment_id = self.kwargs['comment_id']
#         return get_object_or_404(Comment, id=comment_id, blog_id=blog_id)

# class CommentCreateView(generics.CreateAPIView):
#     serializer_class = CommentSerializer

#     def perform_create(self, serializer):
#         blog = get_object_or_404(Blog, id=self.kwargs['blog_id'])
#         serializer.save(blog=blog)
