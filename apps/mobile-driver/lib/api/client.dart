import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/driver_route.dart';
import '../models/health.dart';
import '../models/status_update.dart';

class ApiException implements Exception {
  const ApiException(this.statusCode);

  final int statusCode;

  @override
  String toString() => 'HTTP $statusCode';
}

class ApiClient {
  ApiClient({http.Client? httpClient, String? pin})
      : _http = httpClient ?? http.Client(),
        pin = pin ?? '';

  final http.Client _http;
  final String pin;

  // Linux default http://127.0.0.1:8000; Android emulator http://10.0.2.2:8000.
  static const String baseUrl = String.fromEnvironment(
    'API_BASE',
    defaultValue: 'http://127.0.0.1:8000',
  );

  static const Duration timeout = Duration(seconds: 15);

  Future<HealthOut> getHealth() async {
    final res = await _http
        .get(Uri.parse('$baseUrl/health'))
        .timeout(timeout);
    if (res.statusCode != 200) {
      throw ApiException(res.statusCode);
    }
    return HealthOut.fromJson(jsonDecode(res.body) as Map<String, dynamic>);
  }

  Future<DriverRouteList> getDriverRoute({String? plate}) async {
    var uri = Uri.parse('$baseUrl/driver/route');
    if (plate != null && plate.isNotEmpty) {
      uri = uri.replace(queryParameters: {'plate': plate});
    }
    final res = await _http
        .get(uri, headers: {'X-Driver-Pin': pin})
        .timeout(timeout);
    if (res.statusCode != 200) {
      throw ApiException(res.statusCode);
    }
    return DriverRouteList.fromJson(
      jsonDecode(res.body) as Map<String, dynamic>,
    );
  }

  Future<StatusOut> postStatus(int id, StatusIn body) async {
    final res = await _http
        .post(
          Uri.parse('$baseUrl/stops/$id/status'),
          headers: {
            'Content-Type': 'application/json',
            'X-Driver-Pin': pin,
          },
          body: jsonEncode(body.toJson()),
        )
        .timeout(timeout);
    if (res.statusCode != 200) {
      throw ApiException(res.statusCode);
    }
    return StatusOut.fromJson(jsonDecode(res.body) as Map<String, dynamic>);
  }
}
