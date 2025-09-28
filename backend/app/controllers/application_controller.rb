class ApplicationController < ActionController::API
  # JSON形式でのパラメータラッピングを無効化
  wrap_parameters format: []
end