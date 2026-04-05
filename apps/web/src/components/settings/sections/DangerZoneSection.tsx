'use client';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useGameStore } from '@/store/gameStore';
import { toast } from '@/lib/toast';

export function DangerZoneSection() {
  const resetAllProgress = useGameStore((s) => s.resetAllProgress);

  const handleReset = () => {
    const confirmed =
      typeof window !== 'undefined' &&
      window.confirm('รีเซ็ตต้นไม้ทั้งหมดและสถิติ? การกระทำนี้ย้อนกลับไม่ได้');
    if (!confirmed) return;
    resetAllProgress();
    toast('รีเซ็ตข้อมูลเรียบร้อย');
  };

  return (
    <section>
      <h2 className="text-sm font-medium text-ink-500 uppercase tracking-wider mb-3">
        Danger zone
      </h2>
      <Card className="p-4 border-danger/30">
        <div className="text-sm text-ink-700 mb-3">
          รีเซ็ตต้นไม้ทุกต้น สถิติ และ streak ทั้งหมด
        </div>
        <Button
          variant="secondary"
          onClick={handleReset}
          className="w-full border-danger/40 text-danger"
        >
          รีเซ็ตข้อมูลทั้งหมด
        </Button>
      </Card>
    </section>
  );
}
