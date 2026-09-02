/// Hand-written from apps/api/openapi.json StopOut / DriverRouteOut (D-15).
/// Wire keys stay snake_case: window_start, order_id, fail_reason, late_risk.
const lateRiskLabel = 'Muộn';

class DriverStop {
  const DriverStop({
    required this.id,
    required this.seq,
    required this.kind,
    required this.orderId,
    required this.lat,
    required this.lng,
    required this.address,
    required this.phone,
    required this.windowStart,
    required this.windowEnd,
    required this.notes,
    required this.kg,
    required this.status,
    required this.failReason,
    this.lateRisk = false,
  });

  final int id;
  final int seq;
  final String kind;
  final int? orderId;
  final double lat;
  final double lng;
  final String address;
  final String phone;
  final String windowStart;
  final String windowEnd;
  final String notes;
  final double kg;
  final String status;
  final String? failReason;
  final bool lateRisk;

  factory DriverStop.fromJson(Map<String, dynamic> json) {
    return DriverStop(
      id: json['id'] as int,
      seq: json['seq'] as int,
      kind: json['kind'] as String,
      orderId: json['order_id'] as int?,
      lat: (json['lat'] as num).toDouble(),
      lng: (json['lng'] as num).toDouble(),
      address: json['address'] as String,
      phone: json['phone'] as String,
      windowStart: json['window_start'] as String,
      windowEnd: json['window_end'] as String,
      notes: json['notes'] as String,
      kg: (json['kg'] as num).toDouble(),
      status: json['status'] as String,
      failReason: json['fail_reason'] as String?,
      lateRisk: json['late_risk'] as bool? ?? false,
    );
  }
}

class DriverRoute {
  const DriverRoute({required this.plate, required this.stops});

  final String plate;
  final List<DriverStop> stops;

  factory DriverRoute.fromJson(Map<String, dynamic> json) {
    final rawStops = json['stops'] as List<dynamic>? ?? const [];
    return DriverRoute(
      plate: json['plate'] as String,
      stops: rawStops
          .map((item) => DriverStop.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }
}

class DriverRouteList {
  const DriverRouteList({required this.routes});

  final List<DriverRoute> routes;

  factory DriverRouteList.fromJson(Map<String, dynamic> json) {
    final raw = json['routes'] as List<dynamic>? ?? const [];
    return DriverRouteList(
      routes: raw
          .map((item) => DriverRoute.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }
}
