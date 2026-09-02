class HealthOut {
  const HealthOut({required this.status});

  final String status;

  factory HealthOut.fromJson(Map<String, dynamic> json) {
    return HealthOut(status: json['status'] as String);
  }
}
