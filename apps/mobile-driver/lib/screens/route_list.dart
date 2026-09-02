import 'package:flutter/material.dart';

import '../api/client.dart';
import '../models/driver_route.dart';
import 'stop_detail.dart';

/// Ordered stop list. OpenAPI fields: address, phone, window_start, notes (DRV-01).
class RouteListScreen extends StatefulWidget {
  const RouteListScreen({super.key, required this.routes, this.client});

  final DriverRouteList routes;
  final ApiClient? client;

  static const String emptyLabel = 'Chưa có tuyến đã xuất bản';

  @override
  State<RouteListScreen> createState() => _RouteListScreenState();
}

class _RouteListScreenState extends State<RouteListScreen> {
  late DriverRouteList routes;

  @override
  void initState() {
    super.initState();
    routes = widget.routes;
  }

  void _replaceStop(DriverStop updated) {
    setState(() {
      routes = DriverRouteList(
        routes: [
          for (final route in routes.routes)
            DriverRoute(
              plate: route.plate,
              stops: [
                for (final stop in route.stops)
                  if (stop.id == updated.id) updated else stop,
              ],
            ),
        ],
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    if (routes.routes.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Tuyến giao')),
        body: const Center(child: Text(RouteListScreen.emptyLabel)),
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
                Text(stop.status),
              ],
            ),
            isThreeLine: true,
            onTap: () async {
              final updated = await Navigator.of(context).push<DriverStop>(
                MaterialPageRoute<DriverStop>(
                  builder: (_) => StopDetailScreen(
                    stop: stop,
                    client: widget.client,
                  ),
                ),
              );
              if (updated != null) {
                _replaceStop(updated);
              }
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
