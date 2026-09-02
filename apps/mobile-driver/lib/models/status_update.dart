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
