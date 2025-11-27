export class ApproverDto {
  id: number;
  academic_position?: string | null;
  pronoun?: string | null;
  thai_name: string;
  english_name?: string;
  department?: string;
  position?: string;
  position_approver?: string;
  updated_at?: string;
  created_at?: string;
  level: number[];
}
