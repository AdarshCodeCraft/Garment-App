export type DefectType = 'hole' | 'stain' | 'uneven_stitching' | 'color_mismatch' | 'misaligned_pattern';

export interface DefectArea {
  type: DefectType;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
}

export interface FabricComposition {
  cotton: number;
  polyester: number;
  other: number;
}

export interface InspectionResult {
  id: string;
  imageUri: string;
  timestamp: number;
  defects: DefectArea[];
  fabricType: FabricComposition;
  overallQuality: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
}
