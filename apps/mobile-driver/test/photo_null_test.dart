import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mobile_driver/api/client.dart';
import 'package:mobile_driver/models/driver_route.dart';
import 'package:mobile_driver/screens/stop_detail.dart';

DriverStop _stop() {
  return const DriverStop(
    id: 1,
    seq: 1,
    kind: 'stop',
    orderId: 1,
    lat: 10.776,
    lng: 106.7,
    address: 'Q1',
    phone: '0900000001',
    windowStart: '08:00',
    windowEnd: '11:00',
    notes: '',
    kg: 10,
    status: 'pending',
    failReason: null,
  );
}

void main() {
  testWidgets('picker null still posts delivered without photo', (tester) async {
    var statusCalls = 0;
    var photoCalls = 0;
    final mock = MockClient((request) async {
      if (request.url.path.contains('/photo')) {
        photoCalls += 1;
        return http.Response(
          '{"id":1,"status":"pending","reason":null}',
          200,
          headers: {'content-type': 'application/json'},
        );
      }
      statusCalls += 1;
      expect(request.method, 'POST');
      expect(request.url.path, '/stops/1/status');
      expect(request.headers['X-Driver-Pin'], '0000');
      return http.Response(
        '{"id":1,"status":"delivered","reason":null}',
        200,
        headers: {'content-type': 'application/json'},
      );
    });
    final client = ApiClient(httpClient: mock, pin: '0000');

    await tester.pumpWidget(
      MaterialApp(
        home: Builder(
          builder: (context) {
            return ElevatedButton(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => StopDetailScreen(
                      stop: _stop(),
                      client: client,
                      pickPhoto: () async => null,
                    ),
                  ),
                );
              },
              child: const Text('open'),
            );
          },
        ),
      ),
    );
    await tester.tap(find.text('open'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Đã giao'));
    await tester.pumpAndSettle();
    expect(statusCalls, 1);
    expect(photoCalls, 0);
  });
}
