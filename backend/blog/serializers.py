from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Blog, Comment


class CommentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Comment
        fields = ['id', 'blog', 'author', 'content', 'created_at']
        
        read_only_fields = ['id','blog', 'author','created_at']
        extra_kwargs = {
            'content': {'required': True}
        }


class BlogSerializer(serializers.ModelSerializer):
    
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'author', 'created_at', 'comments']
        
        read_only_fields = ['id', 'author', 'created_at', 'comments']
        extra_kwargs = {
            'title': {'required': True},
            'content': {'required': True}
        }
        
    def validate_title(self, value):
        if 'Django' not in value:
            raise serializers.ValidationError("标题必须包含 'Django'")
        return value

    def validate(self, data):
        if len(data.get('content', '')) < 50:
            raise serializers.ValidationError("内容长度不能少于 50 个字符")
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user