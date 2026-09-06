import 'package:flutter/material.dart';

import 'screens/pin_screen.dart';

void main() {
  runApp(const GreenLogixDriverApp());
}

class GreenLogixDriverApp extends StatelessWidget {
  const GreenLogixDriverApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'GreenLogix Driver',
      home: PinScreen(),
    );
  }
}
