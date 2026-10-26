'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Task {
  no: number;
  cognitive?: string;
  type?: string;
  score?: string;
  action?: string;
  question: string;
  options?: string[];
  answer?: string;
  rubric?: string;
}

interface TaskBundle {
  id: string;
  subject: string;
  title: string;
  text: string;
  tasks: Task[];
  createdAt?: string;
  dueDate?: string;
}

function StudentRoomContent() {
  const searchParams = useSearchParams();

  const [assignedBundles, setAssignedBundles] = useState<TaskBundle[]>([]);
  const [showBundleList, setShowBundleList] = useState(false);
  const [activeBundle, setActiveBundle] = useState<TaskBundle | null>(null);

  // СУРАГЧИЙН МЭДЭЭЛЭЛ
  const [studentName, setStudentName] = useState('Сурагч');
  const [studentEmail, setStudentEmail] = useState('');

  // ТАЙМЕР БА ТӨЛӨВҮҮД
  const [testStarted, setTestStarted] = useState(true);
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [chatTimeLeft, setChatTimeLeft] = useState(20 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completedBundles, setCompletedBundles] = useState<Record<string, boolean>>({});

  // QR ХОЛБОЛТ
  const [showQrModal, setShowQrModal] = useState(false);

  // ҮНЭЛГЭЭНИЙ 3 ТҮВШИН БА ХАРИУЛТУУД
  const [editRecall, setEditRecall] = useState(0); // Мэдээлэл олох / Сэргээн санах
  const [editAnalyze, setEditAnalyze] = useState(0); // Задлан шинжлэх
  const [editEval, setEditEval] = useState(0); // Эргэцүүлэн дүгнэх

  const [taskScores, setTaskScores] = useState<Record<number, { earned: number; max: number; feedback: string }>>({});
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});

  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Миний хүү өнөөдрийн даалгавраа амжилттай хийж дуусгалаа. Доорх 3 түвшний үнэлгээ болон жишиг зөв хариулттай танилцаад асуух зүйл байвал өвөөгөөсөө асуугаарай!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const nameParam = searchParams.get('name');
    const taskIdParam = searchParams.get('taskId');

    let currentName = '';
    let currentEmail = '';

    if (nameParam) {
      currentName = decodeURIComponent(nameParam).trim();
    } else if (emailParam) {
      const decodedEmail = decodeURIComponent(emailParam).toLowerCase().trim();
      currentEmail = decodedEmail;
      const namePart = decodedEmail.split('@')[0].replace(/[0-9]/g, '');
      currentName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    } else {
      currentName = 'Сурагч';
    }

    if (emailParam) {
      currentEmail = decodeURIComponent(emailParam).toLowerCase().trim();
    }

    setStudentName(currentName);
    setStudentEmail(currentEmail);

    let loadedBundles: TaskBundle[] = [];

    const possibleKeys = [
      'teacher_assigned_tasks',
      'teacher_created_task_bundles',
      'creative_reading_task_bank_v12',
      'assigned_tasks_9E',
      'sent_tasks_9E'
    ];

    possibleKeys.forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: any) => {
              if (item && (item.title || item.subject)) {
                const formattedBundle: TaskBundle = {
                  id: item.id || 'TASK-' + Math.random().toString(36).substr(2, 9),
                  subject: item.subject || 'Нийтлэг хичээл',
                  title: item.title || item.name || 'Багшийн даалгавар',
                  text: item.text || item.content || item.story || '',
                  tasks: Array.isArray(item.tasks) ? item.tasks : Array.isArray(item.questions) ? item.questions : [],
                  createdAt: item.createdAt || new Date().toLocaleDateString('mn-MN')
                };

                if (!loadedBundles.some((b) => b.id === formattedBundle.id || b.title === formattedBundle.title)) {
                  loadedBundles.push(formattedBundle);
                }
              }
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    });

    setAssignedBundles(loadedBundles);

    if (loadedBundles.length > 0) {
      const selectedTask = loadedBundles.find((b: TaskBundle) => b.id === taskIdParam) || loadedBundles[0];
      setActiveBundle(selectedTask);
    } else {
      setActiveBundle(null);
    }
  }, [searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testStarted && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, isSubmitted, timeLeft]);

  useEffect(() => {
    let chatTimer: NodeJS.Timeout;
    if (isSubmitted && chatTimeLeft > 0) {
      chatTimer = setInterval(() => {
        setChatTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(chatTimer);
  }, [isSubmitted, chatTimeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const startTest = (bundle: TaskBundle) => {
    if (completedBundles[bundle.id]) {
      alert('Энэ даалгаврыг та хэдийнэ гүйцэтгээд илгээсэн байна.');
      return;
    }
    setActiveBundle(bundle);
    setTestStarted(true);
    setIsSubmitted(false);
    setTimeLeft(40 * 60);
    setStudentAnswers({});
    setShowBundleList(false);
  };

  const handleAnswerSelect = (taskNo: number, value: string) => {
    if (isSubmitted) return;
    setStudentAnswers((prev) => ({ ...prev, [taskNo]: value }));
  };

  // ДААЛГАВРЫН 3 ТҮВШНИЙ ОНООГ БОДИГООР БОДОЖ ОГТЛОХ ЛОГИК
  const evaluateTask = (t: any, studentAns: string) => {
    const ans = (studentAns || '').trim();
    const correctAns = (t.answer || '').trim();
    const options = t.options || t.choices;
    const isMultipleChoice = Array.isArray(options) && options.length > 0;

    let maxScore = 2;
    if (t.score) {
      const parts = t.score.split('-');
      maxScore = parseInt(parts[parts.length - 1]) || 2;
    }

    if (!ans) {
      return { earned: 0, max: maxScore, feedback: 'Хариулт бичээгүй/сонгоогүй тул оноо олгогдоогүй.' };
    }

    if (isMultipleChoice) {
      if (correctAns && ans.toLowerCase() === correctAns.toLowerCase()) {
        return { earned: maxScore, max: maxScore, feedback: 'Зөв сонголт хийсэн байна.' };
      } else if (correctAns) {
        return { earned: 0, max: maxScore, feedback: `Буруу сонголт хийсэн. Сонгосон: "${ans}"` };
      } else {
        return { earned: maxScore, max: maxScore, feedback: 'Хариултыг амжилттай бүртгэсэн.' };
      }
    } else {
      if (correctAns && ans.toLowerCase().includes(correctAns.toLowerCase())) {
        return { earned: maxScore, max: maxScore, feedback: 'Бүрэн ба оновчтой хариулсан.' };
      } else if (ans.length > 15) {
        return { earned: Math.ceil(maxScore / 2), max: maxScore, feedback: 'Хариулт товч эсвэл дутуу байна. Дэлгэрэнгүй тайлбарлана уу.' };
      } else {
        return { earned: 0, max: maxScore, feedback: 'Хариулт хангалтгүй эсвэл асуултын агуулгатай тохироогүй байна.' };
      }
    }
  };

  const handleSubmit = (auto = false) => {
    if (auto || confirm('Даалгавраа багш руу илгээхдээ итгэлтэй байна уу?')) {
      setIsSubmitted(true);
      if (activeBundle) {
        setCompletedBundles((prev) => ({ ...prev, [activeBundle.id]: true }));

        let recallEarned = 0;
        let analyzeEarned = 0;
        let evalEarned = 0;
        const newScores: Record<number, { earned: number; max: number; feedback: string }> = {};

        activeBundle.tasks.forEach((t: any, idx: number) => {
          const taskNo = t.no || idx + 1;
          const userAns = studentAnswers[taskNo] || '';
          const result = evaluateTask(t, userAns);

          newScores[taskNo] = result;

          const cog = (t.cognitive || '').toLowerCase();
          if (cog.includes('олох') || cog.includes('санах') || taskNo <= 2) {
            recallEarned += result.earned;
          } else if (cog.includes('задлан') || cog.includes('шинжлэх') || taskNo <= 4) {
            analyzeEarned += result.earned;
          } else {
            evalEarned += result.earned;
          }
        });

        setTaskScores(newScores);
        setEditRecall(recallEarned);
        setEditAnalyze(analyzeEarned);
        setEditEval(evalEarned);
      }
      alert('Даалгаврыг 3 түвшингээр шалгаж амжилттай илгээлээ!');
    }
  };

  // ЦЭНДАО ӨВӨӨ БАГШИЙН ЦЭГЦТЭЙ, УТГА ТӨГӨЛДӨР ЧАТ
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatTimeLeft <= 0) return;

    const userText = chatInput.trim();
    const newMsgs = [...chatMessages, { role: 'user', content: userText }];
    setChatMessages(newMsgs);
    setChatInput('');

    // Сурагчийн авсан онооны мэдээллийг чат руу бэлдэж өгөх
    const scoreSummary = activeBundle?.tasks?.map((t: any, idx: number) => {
      const taskNo = t.no || idx + 1;
      const stAns = studentAnswers[taskNo] || 'Бичээгүй';
      const evalInfo = taskScores[taskNo] || { earned: 0, max: 2, feedback: '' };
      return `Даалгавар ${taskNo}: Сурагчийн хариулт: "${stAns}", Жишиг хариулт: "${t.answer || 'Байхгүй'}", Авсан оноо: ${evalInfo.earned}/${evalInfo.max}, Тайлбар: ${evalInfo.feedback}`;
    }).join('\n');

    try {...