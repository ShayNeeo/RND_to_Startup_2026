import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_driver/models/driver_route.dart';
import 'package:mobile_driver/screens/route_list.dart';
import 'package:mobile_driver/screens/stop_detail.dart';

Map<String, dynamic> _stopJson({bool? lateRisk}) {
  return {
    'id': 1,
    'seq': 1,
    'kind': 'stop',
    'order_id': 1,
    'lat': 10.776,
    'lng': 106.7,
    'address': 'Q1',
    'phone': '0900000001',
    'window_start': '08:00',
    'window_end': '10:00',
    'notes': 'goi truoc',
    'kg': 10,
    'status': 'pending',
    'fail_reason': null,
    if (lateRisk != null) 'late_risk': lateRisk,
  };
}

DriverStop _stop({
  required int seq,
  required String address,
  String phone = '0900000001',
  String windowStart = '08:00',
  String windowEnd = '10:00',
  String notes = 'goi truoc',
  bool lateRisk = false,
}) {
  return DriverStop(
    id: seq,
    seq: seq,
    kind: 'stop',
    orderId: seq,
    lat: 10.776,
    lng: 106.7,
    address: address,
    phone: phone,
    windowStart: windowStart,
    windowEnd: windowEnd,
    notes: notes,
    kg: 10,
    status: 'pending',
    failReason: null,
    lateRisk: lateRisk,
  );
}

void main() {
  testWidgets('lists stops in seq order even if fixture is shuffled', (tester) async {
    final list = DriverRouteList(
      routes: [
        DriverRoute(
          plate: '51C-000.01',
          stops: [
            _stop(seq: 2, address: 'Second stop'),
            _stop(seq: 1, address: 'First stop'),
          ],
        ),
      ],
    );
    await tester.pumpWidget(MaterialApp(home: RouteListScreen(routes: list)));
    final first = tester.getTopLeft(find.text('First stop'));
    final second = tester.getTopLeft(find.text('Second stop'));
    expect(first.dy < second.dy, isTrue);
    expect(find.text('0900000001'), findsWidgets);
    expect(find.textContaining('08:00'), findsWidgets);
  });

  testWidgets('empty routes show Vietnamese empty state', (tester) async {
    const list = DriverRouteList(routes: []);
    await tester.pumpWidget(const MaterialApp(home: RouteListScreen(routes: list)));
    expect(find.text('Chưa có tuyến đã xuất bản'), findsOneWidget);
    expect(find.text('First stop'), findsNothing);
  });

  test('fromJson late_risk true', () {
    expect(DriverStop.fromJson(_stopJson(lateRisk: true)).lateRisk, isTrue);
  });

  test('fromJson late_risk false', () {
    expect(DriverStop.fromJson(_stopJson(lateRisk: false)).lateRisk, isFalse);
  });

  test('fromJson missing late_risk defaults false', () {
    expect(DriverStop.fromJson(_stopJson()).lateRisk, isFalse);
  });

  testWidgets('route list shows Muộn only on lateRisk stops', (tester) async {
    final list = DriverRouteList(
      routes: [
        DriverRoute(
          plate: '51C-000.01',
          stops: [
            _stop(seq: 1, address: 'Late stop', lateRisk: true),
            _stop(seq: 2, address: 'On time'),
          ],
        ),
      ],
    );
    await tester.pumpWidget(MaterialApp(home: RouteListScreen(routes: list)));
    expect(find.text('Late stop'), findsOneWidget);
    expect(find.text('On time'), findsOneWidget);
    expect(find.text(lateRiskLabel), findsOneWidget);
  });

  testWidgets('stop detail repeats Muộn; Chỉ đường and status remain', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: StopDetailScreen(
          stop: _stop(seq: 1, address: 'Late stop', lateRisk: true),
        ),
      ),
    );
    expect(find.text(lateRiskLabel), findsOneWidget);
    expect(find.text('Chỉ đường'), findsOneWidget);
    expect(find.text('Đã đến'), findsOneWidget);
    expect(find.text('Đã giao'), findsOneWidget);
    expect(find.text('Thất bại'), findsOneWidget);
  });

  testWidgets('stop detail has no Muộn when lateRisk is false', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: StopDetailScreen(stop: _stop(seq: 1, address: 'On time')),
      ),
    );
    expect(find.text(lateRiskLabel), findsNothing);
    expect(find.text('Chỉ đường'), findsOneWidget);
  });
}
