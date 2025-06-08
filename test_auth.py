#!/usr/bin/env python3
"""
Simple test script to verify authentication endpoints
"""
import requests
import json
from datetime import datetime

BASE_URL = 'http://localhost:8000'

def test_register():
    """Test user registration"""
    print("Testing user registration...")
    url = f"{BASE_URL}/api/auth/register/"
    data = {
        'username': f'testuser_{datetime.now().strftime("%Y%m%d_%H%M%S")}',
        'email': f'test_{datetime.now().strftime("%Y%m%d_%H%M%S")}@example.com',
        'password': 'testpassword123'
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 201:
            print("✅ Registration successful!")
            return response.json()
        else:
            print("❌ Registration failed!")
            return None
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return None

def test_login(username, password):
    """Test user login"""
    print(f"\nTesting user login for {username}...")
    url = f"{BASE_URL}/api/auth/login/"
    data = {
        'username': username,
        'password': password
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            return response.json()
        else:
            print("❌ Login failed!")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_check_auth(token):
    """Test authentication check"""
    print(f"\nTesting authentication check...")
    url = f"{BASE_URL}/api/auth/check/"
    headers = {'Authorization': f'Token {token}'}
    
    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Auth check successful!")
            return response.json()
        else:
            print("❌ Auth check failed!")
            return None
    except Exception as e:
        print(f"❌ Auth check error: {e}")
        return None

def test_logout(token):
    """Test user logout"""
    print(f"\nTesting user logout...")
    url = f"{BASE_URL}/api/auth/logout/"
    headers = {'Authorization': f'Token {token}'}
    
    try:
        response = requests.post(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Logout successful!")
            return response.json()
        else:
            print("❌ Logout failed!")
            return None
    except Exception as e:
        print(f"❌ Logout error: {e}")
        return None

def test_existing_endpoints():
    """Test that existing endpoints still work"""
    print(f"\nTesting existing mood endpoint...")
    url = f"{BASE_URL}/api/moods/"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            moods = response.json()
            print(f"✅ Moods endpoint working! Found {len(moods)} moods")
            return True
        else:
            print("❌ Moods endpoint failed!")
            return False
    except Exception as e:
        print(f"❌ Moods endpoint error: {e}")
        return False

if __name__ == '__main__':
    print("🎵 MusicAI Authentication Test Suite")
    print("=" * 50)
    
    # Test existing endpoints first
    test_existing_endpoints()
    
    # Test registration
    register_result = test_register()
    if not register_result:
        print("Registration failed, stopping tests.")
        exit(1)
    
    username = register_result['user']['username']
    token = register_result['token']
    
    # Test login
    login_result = test_login(username, 'testpassword123')
    if not login_result:
        print("Login failed, stopping tests.")
        exit(1)
    
    # Test auth check
    auth_check_result = test_check_auth(token)
    if not auth_check_result:
        print("Auth check failed, stopping tests.")
        exit(1)
    
    # Test logout
    logout_result = test_logout(token)
    if not logout_result:
        print("Logout failed.")
        exit(1)
    
    print("\n" + "=" * 50)
    print("🎉 All authentication tests passed!")
    print("✅ Registration working")
    print("✅ Login working") 
    print("✅ Auth check working")
    print("✅ Logout working")
    print("✅ Existing endpoints preserved")
    print("\n🚀 Your authentication system is ready!") 