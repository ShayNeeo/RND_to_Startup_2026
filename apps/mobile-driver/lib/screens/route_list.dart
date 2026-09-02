import 'package:flutter/material.dart';

import '../api/client.dart';
import '../models/driver_route.dart';
import 'stop_detail.dart';

/// Ordered stop list. OpenAPI fields: address, phone, window_start, notes (DRV-01).
class RouteListScreen extends StatelessWidget {
  const RouteListScreen({super.key, required this.routes, this.client});

  final DriverRouteList routes;
  final ApiClient? client;

  static const String emptyLabel = 'Chưa có tuyến đã xuất bản';

  @override
  Widget build(BuildContext context) {
    if (routes.routes.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Tuyến giao')),
        body: const Center(child: Text(emptyLabel)),
      );
    }
    final tiles = <Widget>[];
    for (final route in routes.routes) {
      tiles.add(
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
          child: Text(
            route.plate,
            style: Theme.of(context).textTheme.titleMedium,
          ),
        ),
      );
      final stops = [...route.stops]..sort((a, b) => a.seq.compareTo(b.seq));
      for (final stop in stops) {
        tiles.add(
          ListTile(
            leading: Text('${stop.seq}'),
            title: Text(stop.address),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(stop.phone),
                Text('${stop.windowStart}–${stop.windowEnd}'),
                Text(stop.notes),
              ],
            ),
            isThreeLine: true,
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => StopDetailScreen(stop: stop, client: client),
                ),
              );
            },
          ),
        );
      }
    }
    return Scaffold(
      appBar: AppBar(title: const Text('Tuyến giao')),
      body: ListView(children: tiles),
    );
  }
}
