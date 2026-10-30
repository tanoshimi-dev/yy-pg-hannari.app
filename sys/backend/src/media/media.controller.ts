import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { join } from 'path';
import type { Response } from 'express';

const contentsDir =
  process.env.CONTENTS_DIR || join(__dirname, '..', '..', '..', '..', '..', 'doc', 'contents');

// Only plain file/dir names: no path separators, no leading dot (blocks "..", dotfiles)
const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

@Controller('media')
@SkipThrottle()
export class MediaController {
  // Serve only files under <contentsDir>/<slug>/assets/.
  // lesson.md / quiz.json (quiz answers) must not be publicly reachable.
  @Get(':slug/assets/:file')
  getAsset(
    @Param('slug') slug: string,
    @Param('file') file: string,
    @Res() res: Response,
  ) {
    if (!SAFE_NAME.test(slug) || !SAFE_NAME.test(file)) {
      throw new NotFoundException();
    }
    res.sendFile(
      file,
      { root: join(contentsDir, slug, 'assets'), dotfiles: 'deny' },
      (err) => {
        if (err && !res.headersSent) {
          res.status(404).json({ statusCode: 404, message: 'Not Found' });
        }
      },
    );
  }
}
