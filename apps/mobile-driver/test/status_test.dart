import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mobile_driver/api/client.dart';
import 'package:mobile_driver/models/status_update.dart';

void main() {
  test('StatusIn toJson for delivered has reason null', () {
    expect(const StatusIn(status: 'delivered').toJson(), {
      'status': 'delivered',
      'reason': null,
    });
  });

  test('StatusIn toJson for failed includes reason khach_vang', () {
    expect(
      const StatusIn(status: 'failed', reason: 'khach_vang').toJson(),
      {'status': 'failed', 'reason': 'khach_vang'},
    );
  });

  test('postStatus POSTs StatusIn JSON to /stops/{id}/status with PIN', () async {
    http.Request? seen;
    final mock = MockClient((request) async {
      seen = request;
      return http.Response(
        '{"id":1,"status":"delivered","reason":null}',
        200,
        headers: {'content-type': 'application/json'},
      );
    });
    final client = ApiClient(httpClient: mock, pin: '0000');
    final out = await client.postStatus(1, const StatusIn(status: 'delivered'));
    expect(out.status, 'delivered');
    expect(out.reason, isNull);
    expect(seen, isNotNull);
    expect(seen!.method, 'POST');
    expect(seen!.url.path, '/stops/1/status');
    expect(seen!.headers['X-Driver-Pin'], '0000');
    final body = jsonDecode(seen!.body) as Map<String, dynamic>;
    expect(body['status'], 'delivered');
    expect(body['reason'], isNull);
  });
}
