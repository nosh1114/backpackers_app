# 画像圧縮サービス
# ActiveStorageの画像を圧縮して、元の画像を置き換えます
class ImageCompressionService
  # 圧縮設定
  MAX_WIDTH = 1920  # 最大幅（ピクセル）
  MAX_HEIGHT = 1920 # 最大高さ（ピクセル）
  QUALITY = 85      # JPEG品質（0-100）
  WEBP_QUALITY = 85 # WebP品質（0-100）

  def self.compress(blob)
    new.compress(blob)
  end

  def compress(blob)
    return blob unless compressible?(blob)

    original_size = blob.byte_size
    Rails.logger.info "ImageCompressionService: Compressing image #{blob.id}, original size: #{original_size} bytes"

    begin
      # 一時ファイルにダウンロード
      temp_file = Tempfile.new(['image', File.extname(blob.filename.to_s)])
      temp_file.binmode
      temp_file.write(blob.download)
      temp_file.rewind

      # ImageProcessingを使用して圧縮
      processed_file_path, new_content_type = process_image(temp_file.path, blob.content_type)

      # 圧縮後のサイズをログに記録
      compressed_size = File.size(processed_file_path)
      compression_ratio = ((1 - compressed_size.to_f / original_size) * 100).round(2)
      Rails.logger.info "ImageCompressionService: Compressed image #{blob.id}, new size: #{compressed_size} bytes, compression: #{compression_ratio}%"

      # 元のblobを更新
      processed_file = File.open(processed_file_path, 'rb')
      blob.upload(processed_file, identify: false)
      # PNGをJPEGに変換した場合はcontent_typeを更新
      if new_content_type && new_content_type != blob.content_type
        blob.update(content_type: new_content_type)
      end
      blob.save

      # 一時ファイルをクリーンアップ
      temp_file.close
      temp_file.unlink
      processed_file.close
      # processed_file_pathは一時ファイルなので削除
      File.unlink(processed_file_path) if File.exist?(processed_file_path)

      blob
    rescue => e
      Rails.logger.error "ImageCompressionService: Failed to compress image #{blob.id}: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      blob # エラーが発生した場合は元のblobを返す
    ensure
      temp_file&.close
      temp_file&.unlink
      processed_file&.close
      if defined?(processed_file_path) && processed_file_path && File.exist?(processed_file_path)
        File.unlink(processed_file_path)
      end
    end
  end

  private

  def compressible?(blob)
    # JPEG、PNG、WebP、HEICのみ圧縮対象
    %w[image/jpeg image/png image/webp image/heic image/heif].include?(blob.content_type)
  end

  def process_image(file_path, content_type)
    case content_type
    when 'image/jpeg'
      [process_jpeg(file_path), 'image/jpeg']
    when 'image/png'
      [process_png(file_path), 'image/jpeg'] # PNGはJPEGに変換
    when 'image/webp'
      [process_webp(file_path), 'image/webp']
    when 'image/heic', 'image/heif'
      [process_heic(file_path), 'image/jpeg'] # HEICはJPEGに変換
    else
      [file_path, content_type]
    end
  end

  def process_jpeg(file_path)
    ImageProcessing::Vips
      .source(file_path)
      .resize_to_limit(MAX_WIDTH, MAX_HEIGHT)
      .saver(quality: QUALITY, strip: true)
      .call
  end

  def process_png(file_path)
    # PNGはJPEGに変換して圧縮（透明部分は白背景に）
    ImageProcessing::Vips
      .source(file_path)
      .resize_to_limit(MAX_WIDTH, MAX_HEIGHT)
      .convert('jpg')
      .saver(quality: QUALITY, strip: true, background: [255, 255, 255])
      .call
  end

  def process_webp(file_path)
    ImageProcessing::Vips
      .source(file_path)
      .resize_to_limit(MAX_WIDTH, MAX_HEIGHT)
      .saver(quality: WEBP_QUALITY, strip: true)
      .call
  end

  def process_heic(file_path)
    # HEICはJPEGに変換して圧縮
    ImageProcessing::Vips
      .source(file_path)
      .resize_to_limit(MAX_WIDTH, MAX_HEIGHT)
      .convert('jpg')
      .saver(quality: QUALITY, strip: true)
      .call
  end
end

