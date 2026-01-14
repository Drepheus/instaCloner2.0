"""
Download Instagram reels from direct URLs using yt-dlp.
Usage: python download_reels.py <output_dir> <url1> <url2> ...
"""
import sys
import os
import json
import subprocess
import re

def download_reel(url, output_dir):
    """Download a single reel and return info about it."""
    try:
        # Extract shortcode from URL
        shortcode = "unknown"
        match = re.search(r'/reel/([^/?]+)', url)
        if match:
            shortcode = match.group(1)
        else:
            match = re.search(r'/p/([^/?]+)', url)
            if match:
                shortcode = match.group(1)
        
        output_template = os.path.join(output_dir, f"{shortcode}.%(ext)s")
        thumb_path = os.path.join(output_dir, f"{shortcode}.jpg")
        
        # Run yt-dlp to download
        cmd = [
            sys.executable, "-m", "yt_dlp",
            "--no-warnings",
            "--quiet",
            "-o", output_template,
            "--write-thumbnail",
            "--convert-thumbnails", "jpg",
            "--format", "best",
            url
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        
        if result.returncode != 0:
            return {
                "id": shortcode,
                "error": result.stderr or "Download failed",
                "url": url
            }
        
        # Find the downloaded file
        video_file = None
        for f in os.listdir(output_dir):
            if f.startswith(shortcode) and f.endswith('.mp4'):
                video_file = f
                break
        
        if not video_file:
            # Check for other video formats
            for f in os.listdir(output_dir):
                if f.startswith(shortcode) and any(f.endswith(ext) for ext in ['.webm', '.mkv', '.mp4']):
                    video_file = f
                    break
        
        # Check for thumbnail
        thumb_file = None
        for f in os.listdir(output_dir):
            if f.startswith(shortcode) and f.endswith('.jpg'):
                thumb_file = f
                break
        
        return {
            "id": shortcode,
            "url": url,
            "local_video_path": video_file,
            "local_thumb_path": thumb_file,
            "thumbnail": f"/downloads/{{job_id}}/{thumb_file}" if thumb_file else None,
            "playable_url": f"/downloads/{{job_id}}/{video_file}" if video_file else url,
            "username": "instagram_user",
            "views": 0,
            "likes": 0,
            "comments": 0,
            "score": 0,
            "status": "approved",
            "original_url": url
        }
        
    except subprocess.TimeoutExpired:
        return {"id": shortcode, "error": "Download timed out", "url": url}
    except Exception as e:
        return {"id": shortcode if 'shortcode' in dir() else "unknown", "error": str(e), "url": url}

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python download_reels.py <output_dir> <url1> <url2> ..."}))
        sys.exit(1)
    
    output_dir = sys.argv[1]
    urls = sys.argv[2:]
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    results = []
    for url in urls:
        url = url.strip()
        if not url:
            continue
        sys.stderr.write(f"Downloading: {url}\n")
        result = download_reel(url, output_dir)
        results.append(result)
    
    print(json.dumps(results))

if __name__ == "__main__":
    main()
