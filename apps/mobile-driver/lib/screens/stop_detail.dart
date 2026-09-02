import 'package:flutter/material.dart';

import '../api/client.dart';
import '../api/maps_link.dart';
import '../models/driver_route.dart';

class StopDetailScreen extends StatelessWidget {
  const StopDetailScreen({super.key, required this.stop, this.client});

  final DriverStop stop;
  final ApiClient? client;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(stop.address)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(stop.address),
          Text('${stop.windowStart}–${stop.windowEnd}'),
          Text(stop.notes),
          Text(stop.status),
          const SizedBox(height: 12),
          ElevatedButton(
            onPressed: () => openChiDuong(stop.lat, stop.lng, stop.address),
            child: const Text('Chỉ đường'),
          ),
        ],
      ),
    );
  }
}
