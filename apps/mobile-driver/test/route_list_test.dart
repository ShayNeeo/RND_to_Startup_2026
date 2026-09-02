import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_driver/models/driver_route.dart';
import 'package:mobile_driver/screens/route_list.dart';

DriverStop _stop({
  required int seq,
  required String address,
  String phone = '0900000001',
  String windowStart = '08:00',
  String windowEnd = '10:00',
  String notes = 'goi truoc',
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
}
