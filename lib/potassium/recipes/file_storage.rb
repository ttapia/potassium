class Recipes::FileStorage < Rails::AppBuilder
  def ask
    storages = {
      active_storage: 'ActiveStorage',
      none: 'None, thanks'
    }

    storage = answer(:storage) do
      storages.keys[Ask.list('Which storage are you going to use?', storages.values)]
    end

    set(:storage, storage.to_sym)
  end

  def create
    add_chosen_storage
  end

  def install
    ask
    add_chosen_storage
  end

  def installed?
    file_exist?('config/storage.yml')
  end

  private

  def add_active_storage
    after(:gem_install) { run('bundle exec rails active_storage:install') }
    copy_file('../assets/config/storage.yml', 'config/storage.yml', force: true)
    active_storage_service_regexp = /config.active_storage.service = :local\n/
    gsub_file 'config/environments/production.rb', active_storage_service_regexp do
      'config.active_storage.service = :amazon'
    end
  end

  def common_setup
    gather_gem 'aws-sdk-s3', '~> 1.0'
    add_readme_section :internal_dependencies, get(:storage)
    append_to_file '.env.development', "S3_BUCKET=\n"
  end

  def add_chosen_storage
    return if [:none, :None].include? get(:storage).to_sym

    common_setup
    case get(:storage)
    when :active_storage
      add_active_storage
    end
  end
end
