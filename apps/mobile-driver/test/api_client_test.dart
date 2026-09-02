import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_driver/models/driver_route.dart';

void main() {
  test('parses DriverRouteList fixture from frozen OpenAPI keys', () {
    const raw =
        '{"routes":[{"plate":"51C-000.01","stops":[{"id":1,"seq":1,"kind":"stop","order_id":1,"lat":10.776,"lng":106.7,"address":"Q1","phone":"0900000001","window_start":"08:00","window_end":"11:00","notes":"","kg":10,"status":"pending","fail_reason":null}]}]}';
    final list = DriverRouteList.fromJson(
      jsonDecode(raw) as Map<String, dynamic>,
    );
    expect(list.routes.single.plate, '51C-000.01');
    expect(list.routes.single.stops.single.windowStart, '08:00');
  });
}
