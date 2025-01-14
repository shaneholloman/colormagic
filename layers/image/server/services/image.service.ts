import sharp from 'sharp';
import type { PaletteService } from '~/layers/palette/server/services/palette.service';

export interface SvgParams {
  width?: number
  height?: number
}

export class ImageService {
  constructor(private readonly paletteService: PaletteService) {}

  private async generateSVG(colors: string[], params?: SvgParams): Promise<string> {
    const width = params?.width ?? 1200;
    const height = params?.height ?? 630;

    /** @description build color rectangles */
    const colorBars = colors.map((color, i) => {
      const rectWidth = width / colors.length;
      const x = i * rectWidth;
      return `<rect x="${x}" y="0" width="${rectWidth}" height="${height}" fill="#${color.replace('#', '')}" />`;
    }).join('');

    /** @description build the svg */
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <!-- Background color bars -->
        ${colorBars}
      </svg>
    `;

    return svg;
  }

  public async generateById(id: string, params?: { width: number, height: number }): Promise<Buffer> {
    const palette = await this.paletteService.getById(id);

    const svg = await this.generateSVG(palette.colors, params);
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    return pngBuffer;
  }

  public async generateByTags(tags: string[], params?: { width: number, height: number }): Promise<Buffer> {
    const { items: [palette] } = await this.paletteService.listByTags(0, 1, { tags });

    if (palette?.colors === undefined) {
      throw createError({ statusCode: 404, statusMessage: `palette not found with tags: ${tags.join(',')}` });
    }

    const svg = await this.generateSVG(palette.colors, params);
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    return pngBuffer;
  }

  public async generateByColors(colors: string[]): Promise<Buffer> {
    const svg = await this.generateSVG(colors);
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    return pngBuffer;
  }

  public async generateSquareThumbnail(colors: string[]): Promise<Buffer> {
    const svg = await this.generateSVG(colors, { width: 150, height: 150 });
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    return pngBuffer;
  }
}
