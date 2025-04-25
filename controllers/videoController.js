const { Video } = require('../models');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

exports.uploadVideo = async (req, res) => {
  try {
    const { filename, path: filepath, size } = req.file;

    // Get duration using ffprobe
    ffmpeg.ffprobe(filepath, async (err, metadata) => {
      if (err) return res.status(500).json({ error: 'Could not analyze video' });

      const duration = metadata.format.duration;

      const video = await Video.create({
        filename,
        originalUrl: filepath,
        size,
        duration,
        status: 'uploaded',
      });

      res.status(201).json({ message: 'Uploaded successfully', video });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

exports.trimVideo = async (req, res) => {
  const { id } = req.params;
  const start = parseFloat(req.body.start);
  const end = parseFloat(req.body.end);

  if (isNaN(start) || isNaN(end) || end <= start) {
    return res.status(400).json({ error: 'Invalid start or end time' });
  }

  try {
    const video = await Video.findByPk(id);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const inputPath = video.processedUrl || video.originalUrl;
    const processedDir = path.join(__dirname, '..', 'processed');
    if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir);

    const outputPath = path.join(processedDir, `trimmed-${Date.now()}-${video.filename}`);

    ffmpeg(inputPath)
      .setStartTime(start)
      .setDuration(end - start)
      .output(outputPath)
      .on('end', async () => {
        video.processedUrl = outputPath;
        video.status = 'trimmed';
        await video.save();

        res.status(200).json({ message: 'Trimmed successfully', processedUrl: outputPath });
      })
      .on('error', (err) => {
        console.error('FFmpeg Error:', err);
        res.status(500).json({ error: 'FFmpeg failed' });
      })
      .run();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Trimming failed' });
  }
};

exports.addSubtitles = async (req, res) => {
  const { id } = req.params;
  const { text, start, end } = req.body;

  if (!text || isNaN(start) || isNaN(end) || end <= start) {
    return res.status(400).json({ error: 'Invalid subtitle data' });
  }

  try {
    const video = await Video.findByPk(id);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const inputPath = video.processedUrl || video.originalUrl;
    const processedDir = path.resolve('processed');
    if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });

    const outputPath = path.join(processedDir, `subtitled-${Date.now()}-${video.filename}`);
    const fontPath = 'C\\:/Windows/Fonts/arial.ttf';

    const drawText = `drawtext=fontfile='${fontPath}':text='${text}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=h-50:enable='between(t,${start},${end})'`;

    ffmpeg(inputPath)
      .videoFilter(drawText)
      .output(outputPath)
      .on('end', async () => {
        video.processedUrl = outputPath;
        video.status = 'subtitled';
        await video.save();
        res.status(200).json({ message: 'Subtitle added', processedUrl: outputPath });
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        res.status(500).json({ error: 'Failed to add subtitle' });
      })
      .run();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Subtitle process failed' });
  }
};

exports.renderFinalVideo = async (req, res) => {
  const { id } = req.params;

  try {
    const video = await Video.findByPk(id);
    if (!video || !video.processedUrl) {
      return res.status(404).json({ error: 'Processed video not found' });
    }

    const renderedDir = path.join(__dirname, '..', 'rendered');
    if (!fs.existsSync(renderedDir)) fs.mkdirSync(renderedDir);

    const finalOutputPath = path.join(renderedDir, `rendered-${Date.now()}-${video.filename}`);
    fs.copyFileSync(video.processedUrl, finalOutputPath);

    video.processedUrl = finalOutputPath;
    video.status = 'rendered';
    await video.save();

    res.status(200).json({ message: 'Final video rendered', url: finalOutputPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to render final video' });
  }
};
exports.downloadFinalVideo = async (req, res) => {
  const { id } = req.params;

  try {
    const video = await Video.findByPk(id);
    if (!video || !video.processedUrl || video.status !== 'rendered') {
      return res.status(404).json({ error: 'Final rendered video not available' });
    }

    const filePath = path.resolve(video.processedUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File does not exist on disk' });
    }

    res.download(filePath, `final-${video.filename}`, (err) => {
      if (err) {
        console.error('Download Error:', err);
        res.status(500).json({ error: 'Failed to download video' });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Download failed' });
  }
};
