class StatusIn {
  const StatusIn({required this.status, this.reason});

  final String status;
  final String? reason;

  Map<String, dynamic> toJson() {
    return {
      'status': status,
      'reason': reason,
    };
  }
}

class StatusOut {
  const StatusOut({required this.id, required this.status, this.reason});

  final int id;
  final String status;
  final String? reason;

  factory StatusOut.fromJson(Map<String, dynamic> json) {
    return StatusOut(
      id: json['id'] as int,
      status: json['status'] as String,
      reason: json['reason'] as String?,
    );
  }
}
