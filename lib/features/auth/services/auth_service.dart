import 'dart:convert';

import 'package:amazon_clone/constants/error_handling.dart';
import 'package:amazon_clone/constants/global_variables.dart';
import 'package:amazon_clone/constants/utils.dart';
import 'package:amazon_clone/features/home/screens/home_screen.dart';
import 'package:amazon_clone/models/user.dart';
import 'package:amazon_clone/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  void signUpUser({
    required String email,
    required BuildContext context,
    required String password,
    required String name,
  }) async {
    try {
      User user = User(
        address: '',
        id: '',
        password: password,
        token: '',
        type: '',
        email: email,
        name: name,
      );

      // ignore: unnecessary_brace_in_string_interps
      http.Response res = await http.post(
        Uri.parse('${uri}/api/signup'),
        body: user.toJson(),
        headers: <String, String>{
          'Content-Type': "application/json; charset=UTF-8",
        },
      );
      httpErrorHandle(
        res: res,
        context: context,
        onSuccess: () => showSnackBar(
          context,
          'Account created! Login with your credentials',
        ),
      );
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }

  void signInUser({
    required String email,
    required String password,
    required BuildContext context,
  }) async {
    try {
      http.Response res = await http.post(
        Uri.parse('${uri}/api/login'),
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
        headers: <String, String>{
          'Content-Type': "application/json; charset=UTF-8",
        },
      );
      httpErrorHandle(
        res: res,
        context: context,
        onSuccess: () async {
          SharedPreferences prefs = await SharedPreferences.getInstance();
          Provider.of<UserProvider>(context, listen: false).setUser(res.body);
          await prefs.setString('x-auth-token', jsonDecode(res.body)['token']);
          Navigator.pushNamedAndRemoveUntil(
            context,
            HomeScreen.routeName,
            (route) => false,
          );
        },
      );
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }
}
