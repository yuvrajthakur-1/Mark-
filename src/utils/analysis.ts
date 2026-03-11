export interface TestReport {
  id: string;
  email: string;
  testId: string;
  subject: string;
  chapter: string;
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  score: number;
  timeTaken: number;
  date: string;
}

export function overallStats(reports: TestReport[]) {
  let correct = 0;
  let wrong = 0;
  let total = 0;

  reports.forEach(r => {
    correct += r.correct;
    wrong += r.wrong;
    total += r.total;
  });

  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(2) : '0.00';

  return { correct, wrong, total, accuracy };
}

export function subjectStats(reports: TestReport[]) {
  const subjects: Record<string, { correct: number; total: number }> = {};

  reports.forEach(r => {
    if (!subjects[r.subject]) {
      subjects[r.subject] = { correct: 0, total: 0 };
    }
    subjects[r.subject].correct += r.correct;
    subjects[r.subject].total += r.total;
  });

  return subjects;
}

export function chapterStats(reports: TestReport[]) {
  const chapters: Record<string, { correct: number; total: number }> = {};

  reports.forEach(r => {
    if (!chapters[r.chapter]) {
      chapters[r.chapter] = { correct: 0, total: 0 };
    }
    chapters[r.chapter].correct += r.correct;
    chapters[r.chapter].total += r.total;
  });

  return chapters;
}

export function weakChapters(chapters: Record<string, { correct: number; total: number }>) {
  return Object.entries(chapters)
    .filter(([_, data]) => {
      const acc = data.total > 0 ? (data.correct / data.total) * 100 : 0;
      return acc < 60;
    })
    .map(([chapter, data]) => ({
      chapter,
      accuracy: data.total > 0 ? ((data.correct / data.total) * 100).toFixed(2) : '0.00'
    }));
}

export function timeAnalysis(reports: TestReport[]) {
  if (reports.length === 0) return 0;
  let totalTime = 0;

  reports.forEach(r => {
    totalTime += r.timeTaken;
  });

  const avg = totalTime / reports.length;
  return avg;
}

export function accuracyTrend(reports: TestReport[]) {
  return reports.map(r => {
    return {
      date: r.date,
      accuracy: r.total > 0 ? (r.correct / r.total) * 100 : 0
    };
  });
}

export function saveTestReport(report: Omit<TestReport, 'id'>) {
  const reports = getTestReports();
  const newReport = { ...report, id: Date.now().toString() };
  reports.push(newReport);
  localStorage.setItem('mark_reports', JSON.stringify(reports));
  return newReport;
}

export function getTestReports(): TestReport[] {
  const data = localStorage.getItem('mark_reports');
  return data ? JSON.parse(data) : [];
}
