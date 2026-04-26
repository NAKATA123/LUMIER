Rails.application.routes.draw do
  root "home#index"

  # aboutページ（ルミエールのご紹介）
  get "about", to: "home#about"

  #料金ページ
  get "price", to: "home#price"

  # 個人情報ページ
  get "privacy", to: "static#privacy"

  # ヘルスチェック
  get "up" => "rails/health#show", as: :rails_health_check
end
