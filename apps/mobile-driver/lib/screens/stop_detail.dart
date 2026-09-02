import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../api/client.dart';
import '../api/maps_link.dart';
import '../models/driver_route.dart';
import '../models/status_update.dart';

const failReasons = <String>[
  'khach_vang',
  'sai_dia_chi',
  'hang_hong',
  'tu_choi',
];

class StopDetailScreen extends StatefulWidget {
  const StopDetailScreen({
    super.key,
    required this.stop,
    this.client,
    this.pickPhoto,
  });

  final DriverStop stop;
  final ApiClient? client;
  final Future<XFile?> Function()? pickPhoto;

  @override
  State<StopDetailScreen> createState() => _StopDetailScreenState();
}

class _StopDetailScreenState extends State<StopDetailScreen> {
  late DriverStop stop;
  bool busy = false;
  String? message;

  @override
  void initState() {
    super.initState();
    stop = widget.stop;
  }

  DriverStop _copyStatus(String status, String? reason) {
    return DriverStop(
      id: stop.id,
      seq: stop.seq,
      kind: stop.kind,
      orderId: stop.orderId,
      lat: stop.lat,
      lng: stop.lng,
      address: stop.address,
      phone: stop.phone,
      windowStart: stop.windowStart,
      windowEnd: stop.windowEnd,
      notes: stop.notes,
      kg: stop.kg,
      status: status,
      failReason: reason,
    );
  }

  Future<void> _post(String status, {String? reason}) async {
    final client = widget.client;
    if (client == null) {
      return;
    }
    setState(() {
      busy = true;
      message = null;
    });
    try {
      await client.postStatus(stop.id, StatusIn(status: status, reason: reason));
      final updated = _copyStatus(status, reason);
      setState(() {
        stop = updated;
      });
      if (mounted) {
        Navigator.of(context).pop(updated);
      }
    } on ApiException catch (err) {
      if (mounted) {
        setState(() {
          message = '${err.statusCode}';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          busy = false;
        });
      }
    }
  }

  Future<XFile?> _pickPhoto() async {
    try {
      if (widget.pickPhoto != null) {
        return await widget.pickPhoto!();
      }
      return await ImagePicker().pickImage(source: ImageSource.camera);
    } catch (_) {
      return null;
    }
  }

  Future<void> _deliver() async {
    final client = widget.client;
    if (client == null) {
      return;
    }
    setState(() {
      busy = true;
      message = null;
    });
    try {
      XFile? file;
      try {
        file = await _pickPhoto();
      } catch (_) {
        file = null;
      }
      if (file != null) {
        try {
          await client.postPhoto(stop.id, await file.readAsBytes());
        } catch (_) {
          // Photo is optional; status still proceeds (D-20).
        }
      }
      await client.postStatus(stop.id, const StatusIn(status: 'delivered'));
      final updated = _copyStatus('delivered', null);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('status saved')),
        );
        setState(() {
          stop = updated;
        });
        Navigator.of(context).pop(updated);
      }
    } on ApiException catch (err) {
      if (mounted) {
        setState(() {
          message = '${err.statusCode}';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          busy = false;
        });
      }
    }
  }

  Future<void> _fail() async {
    final picked = await showDialog<String>(
      context: context,
      builder: (ctx) {
        return SimpleDialog(
          title: const Text('Thất bại'),
          children: [
            for (final reason in failReasons)
              SimpleDialogOption(
                onPressed: () => Navigator.of(ctx).pop(reason),
                child: Text(reason),
              ),
          ],
        );
      },
    );
    if (picked == null) {
      return;
    }
    await _post('failed', reason: picked);
  }

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
          if (stop.failReason != null) Text(stop.failReason!),
          const SizedBox(height: 12),
          ElevatedButton(
            onPressed: () => openChiDuong(stop.lat, stop.lng, stop.address),
            child: const Text('Chỉ đường'),
          ),
          const SizedBox(height: 8),
          ElevatedButton(
            onPressed: busy ? null : () => _post('arrived'),
            child: const Text('Đã đến'),
          ),
          ElevatedButton(
            onPressed: busy ? null : _deliver,
            child: const Text('Đã giao'),
          ),
          ElevatedButton(
            onPressed: busy ? null : _fail,
            child: const Text('Thất bại'),
          ),
          if (message != null) ...[
            const SizedBox(height: 12),
            Text(message!),
          ],
        ],
      ),
    );
  }
}
