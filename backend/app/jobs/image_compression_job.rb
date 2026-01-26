# 画像圧縮ジョブ
# バックグラウンドで画像を圧縮します
class ImageCompressionJob < ApplicationJob
  queue_as :default

  def perform(blob_id)
    blob = ActiveStorage::Blob.find_by(id: blob_id)
    return unless blob

    ImageCompressionService.compress(blob)
  end
end

