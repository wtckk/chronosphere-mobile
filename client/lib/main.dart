import 'dart:async';

import 'package:flutter/material.dart';
// Пример пакета для кругового индикатора
import 'package:percent_indicator/circular_percent_indicator.dart';

void main() {
  runApp(const TimeTrackerApp());
}

class TimeTrackerApp extends StatelessWidget {
  const TimeTrackerApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Time Tracker',
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: Color(0xFF9D66F2), // Фиолетовый
        scaffoldBackgroundColor: Color(0xFF1F1D2B),
        textTheme: const TextTheme(
          titleLarge: TextStyle(color: Colors.white),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: Color(0xFF9D66F2),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30),
            ),
            textStyle: TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
      ),
      home: const MainMenuScreen(),
    );
  }
}

class MainMenuScreen extends StatelessWidget {
  const MainMenuScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Time Tracker'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Spacer(),
            Text(
              'Сегодня',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.w600),
            ),
            SizedBox(height: 20),
            TaskCard(taskTitle: 'Чтение 30 минут', plannedTime: '30'),
            TaskCard(taskTitle: 'UI Design', plannedTime: '60'),
            Spacer(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(context,
                      MaterialPageRoute(builder: (context) => TimerScreen(taskName: 'Задача X')));
                  },
                  child: Text('Запустить таймер'),
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(context,
                      MaterialPageRoute(builder: (context) => StatsScreen()));
                  },
                  child: Text('Отчеты'),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}

class TaskCard extends StatelessWidget {
  final String taskTitle;
  final String plannedTime;

  const TaskCard({
    Key? key,
    required this.taskTitle,
    required this.plannedTime,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 15),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Color(0xFF2C2A38),
        borderRadius: BorderRadius.circular(15),
      ),
      child: Row(
        children: [
          Icon(Icons.check_circle_outline, color: Colors.white70),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              taskTitle,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            ),
          ),
          Text(
            '$plannedTime мин',
            style: TextStyle(color: Colors.white54),
          ),
        ],
      ),
    );
  }
}

class TimerScreen extends StatefulWidget {
  final String taskName;

  const TimerScreen({Key? key, required this.taskName}) : super(key: key);

  @override
  State<TimerScreen> createState() => _TimerScreenState();
}

class _TimerScreenState extends State<TimerScreen> {
  double percent = 0.0;
  bool isRunning = false;
  int secondsPassed = 0;
  late Timer? timer;

  @override
  void initState() {
    super.initState();
    timer = null;
  }

  void _startTimer() {
    setState(() {
      isRunning = true;
    });
    timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        secondsPassed++;
        // Для примера считаем, что 60 секунд = 100% (условно)
        percent = (secondsPassed % 60) / 60;
      });
    });
  }

  void _pauseTimer() {
    setState(() {
      isRunning = false;
    });
    timer?.cancel();
  }

  void _stopTimer() {
    setState(() {
      isRunning = false;
      secondsPassed = 0;
      percent = 0.0;
    });
    timer?.cancel();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.taskName),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Text(
              'Таймер задачи',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
            ),
            SizedBox(height: 30),
            CircularPercentIndicator(
              radius: 120.0,
              lineWidth: 13.0,
              animation: false,
              percent: percent,
              center: Text(
                _formattedTime(secondsPassed),
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
              ),
              circularStrokeCap: CircularStrokeCap.round,
              progressColor: Theme.of(context).primaryColor,
              backgroundColor: Colors.white10,
            ),
            SizedBox(height: 30),
            Text(
              'Режим Pomodoro (80/20)',
              style: TextStyle(fontSize: 16),
            ),
            Switch(
              value: false,
              onChanged: (val) {},
              activeColor: Theme.of(context).primaryColor,
            ),
            Spacer(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: isRunning ? _pauseTimer : _startTimer,
                  child: Text(isRunning ? 'Пауза' : 'Старт'),
                ),
                ElevatedButton(
                  onPressed: _stopTimer,
                  child: Text('Стоп'),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }

  String _formattedTime(int totalSeconds) {
    int hours = totalSeconds ~/ 3600;
    int minutes = (totalSeconds % 3600) ~/ 60;
    int seconds = totalSeconds % 60;

    String twoDigits(int n) => n.toString().padLeft(2, '0');
    String hStr = twoDigits(hours);
    String mStr = twoDigits(minutes);
    String sStr = twoDigits(seconds);

    return "$hStr:$mStr:$sStr";
  }
}

class StatsScreen extends StatelessWidget {
  const StatsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // ЗАГЛУШКА для отчётов
    return Scaffold(
      appBar: AppBar(
        title: Text('Отчеты'),
        centerTitle: true,
      ),
      body: Center(
        child: Text(
          'Здесь будут графики и статистика',
          style: TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}
