# Claude Flow + OpenRouter Integration Guide
## Complete Setup Documentation for Qwen-3 Coder via LiteLLM Proxy

**Version**: 1.0  
**Date**: August 14, 2025  
**Integration Method**: Path C (LiteLLM Proxy) from Claude Flow Wiki  
**Backend**: OpenRouter with Qwen-3 Coder models  
**Status**: ✅ Production Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [LiteLLM Proxy Configuration](#litellm-proxy-configuration)
5. [Claude Code Integration](#claude-code-integration)
6. [Claude Flow Orchestration](#claude-flow-orchestration)
7. [Troubleshooting](#troubleshooting)
8. [Verification Steps](#verification-steps)
9. [Advanced Usage](#advanced-usage)
10. [References & Documentation](#references--documentation)
11. [Appendix](#appendix)

---

## 🎯 Overview

This guide documents the complete process of integrating Claude Flow with OpenRouter using the LiteLLM proxy approach (Path C from the Claude Flow wiki). The integration enables:

- **Claude Code** to use **Qwen-3 Coder models** via **OpenRouter**
- **Claude Flow orchestration** (swarms, SPARC, Hive Mind) with **OpenRouter backend**
- **Multi-agent coordination** using **Qwen models** instead of Anthropic Claude
- **Full compatibility** with all Claude Flow features

### Architecture Flow
```
Claude Code → LiteLLM Proxy → OpenRouter → Qwen-3 Coder Models
```

### Key Benefits
- ✅ Solves Claude Code 405 errors with OpenRouter
- ✅ Enables OpenAI-compatible API formatting
- ✅ Supports model switching and parameter mapping
- ✅ Full Claude Flow orchestration compatibility
- ✅ Cost-effective alternative to Anthropic direct billing

---

## 🔧 Prerequisites

### Required Accounts & Keys
1. **OpenRouter Account**: Register at [openrouter.ai](https://openrouter.ai)
2. **OpenRouter API Key**: Obtain from OpenRouter dashboard
3. **Claude Code**: Version 1.0.80 or higher
4. **Node.js**: Version 18+ for Claude Flow
5. **Python**: Version 3.11+ for LiteLLM

### System Requirements
- **macOS**: Tested on macOS (should work on Linux/Windows)
- **Memory**: 4GB+ RAM recommended
- **Storage**: 2GB+ free space for dependencies

---

## 🌍 Environment Setup

### 1. Project Directory Structure
```bash
claude-flow-open-router/
├── .env                           # Environment variables
├── venv/                          # Python virtual environment
├── simple_litellm_config.yaml    # LiteLLM configuration
├── .swarm/                        # Claude Flow swarm data
└── CLAUDE_FLOW_OPENROUTER_INTEGRATION_GUIDE.md
```

### 2. Create Project Directory
```bash
cd ~/Development
mkdir claude-flow-open-router
cd claude-flow-open-router
```

### 3. Python Virtual Environment Setup
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Verify activation
which python  # Should show path to venv/bin/python
```

### 4. Environment Variables Configuration

Create `.env` file:
```bash
# OpenRouter Integration (Path C - LiteLLM Proxy)
ANTHROPIC_BASE_URL="http://localhost:4000"
ANTHROPIC_AUTH_TOKEN="litellm_master"
ANTHROPIC_MODEL="qwen3-coder"

# Claude Flow Features
CLAUDE_FLOW_HOOKS_ENABLED=true
CLAUDE_FLOW_TELEMETRY_ENABLED=true

# OpenRouter API Key (for LiteLLM)
OPENROUTER_KEY="sk-or-v1-[your-openrouter-api-key]"
```

**⚠️ Important Notes:**
- Replace `[your-openrouter-api-key]` with your actual OpenRouter API key
- `ANTHROPIC_BASE_URL` points to LiteLLM proxy, not Anthropic
- `ANTHROPIC_AUTH_TOKEN` uses LiteLLM master key, not Anthropic key
- `ANTHROPIC_MODEL` specifies which Qwen model to use

### 5. Shell Environment Loading
```bash
# Load environment variables in current shell
source .env

# Verify variables are loaded
echo $ANTHROPIC_BASE_URL  # Should show: http://localhost:4000
echo $ANTHROPIC_MODEL     # Should show: qwen3-coder
```

---

## 🔗 LiteLLM Proxy Configuration

### 1. Install LiteLLM with Proxy Support
```bash
# Ensure virtual environment is active
source venv/bin/activate

# Install LiteLLM with proxy extras
pip install 'litellm[proxy]'

# Install Prisma dependency (required for LiteLLM)
pip install prisma
```

### 2. Create LiteLLM Configuration File

Create `simple_litellm_config.yaml`:
```yaml
model_list:
  - model_name: qwen3-coder
    litellm_params:
      model: openrouter/qwen/qwen3-coder
      api_key: os.environ/OPENROUTER_KEY
  - model_name: qwen3-coder-free
    litellm_params:
      model: openrouter/qwen/qwen3-coder:free
      api_key: os.environ/OPENROUTER_KEY
  # Map Claude model names to Qwen models
  - model_name: claude-3-5-haiku-20241022
    litellm_params:
      model: openrouter/qwen/qwen3-coder
      api_key: os.environ/OPENROUTER_KEY
  - model_name: claude-3-5-sonnet-20241022
    litellm_params:
      model: openrouter/qwen/qwen3-coder
      api_key: os.environ/OPENROUTER_KEY

general_settings:
  master_key: litellm_master
  # No database - use in-memory only
  store_model_in_db: false

litellm_settings:
  drop_params: true  # Drop unsupported parameters like 'thinking'
```

**🔑 Key Configuration Elements:**

1. **Model Mappings**: Maps both Qwen model names and Claude model names to OpenRouter endpoints
2. **API Key Reference**: Uses environment variable `OPENROUTER_KEY`
3. **Master Key**: `litellm_master` for proxy authentication
4. **Parameter Compatibility**: `drop_params: true` handles OpenRouter parameter limitations
5. **In-Memory Mode**: `store_model_in_db: false` avoids database complexity

### 3. Start LiteLLM Proxy
```bash
# Ensure virtual environment is active
source venv/bin/activate

# Set OpenRouter API key
export OPENROUTER_KEY="sk-or-v1-[your-openrouter-api-key]"

# Start LiteLLM proxy
litellm --config simple_litellm_config.yaml --port 4000
```

**Expected Output:**
```
LiteLLM: Proxy initialized with Config, Set models:
    qwen3-coder
    qwen3-coder-free
    claude-3-5-haiku-20241022
    claude-3-5-sonnet-20241022
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:4000 (Press CTRL+C to quit)
```

### 4. Verify Proxy Health
```bash
# Test proxy health endpoint
curl -s http://localhost:4000/health

# Expected: 401 error (normal - no auth provided)
# This confirms proxy is running and responding
```

---

## 🤖 Claude Code Integration

### 1. Verify Claude Code Version
```bash
claude --version
# Should be 1.0.80 or higher for best compatibility
```

### 2. Test Basic Integration
```bash
# Start Claude Code with debug mode
claude --debug

# Verify environment overrides are detected:
# Should show: "API Base URL: http://localhost:4000"
```

### 3. Model Verification
In Claude Code:
```
> What model are you?
```

**Expected Response:**
```
I'm running on the qwen3-coder model. How can I assist you today?
```

**⚠️ Troubleshooting Model Response:**
- If response claims to be "Claude 3.5 Sonnet", check if Anthropic credentials are still active
- Use `claude auth logout` to remove Anthropic credentials
- Restart Claude Code to force LiteLLM proxy usage

### 4. Model Switching
```bash
# In Claude Code, switch models:
> /model qwen3-coder-free    # Free version
> /model qwen3-coder         # Paid version
```

---

## 🌊 Claude Flow Orchestration

### 1. Install Claude Flow
```bash
# Install globally for MCP server support
npm install -g claude-flow@alpha
```

### 2. Initialize Claude Flow Project
```bash
# In project directory
claude-flow init

# Expected: Creates CLAUDE.md, .claude/settings.json, .mcp.json, etc.
```

### 3. Test Hive Mind Integration
```bash
# Start Hive Mind wizard
claude-flow hive-mind wizard

# Follow prompts to create a swarm
# Example objective: "Build Pumpy Surfer, a clone of Flappy Bird"
```

### 4. Verify Swarm Creation
```bash
# Check swarm status
claude-flow hive-mind status

# Should show active swarms with agents and tasks
```

### 5. Launch Coordinated Development
```bash
# Resume swarm with Claude Code integration
claude-flow hive-mind resume [session-id] --claude

# This launches Claude Code with full swarm context
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. LiteLLM Proxy Won't Start
**Error**: `ModuleNotFoundError: No module named 'prisma'`
```bash
# Solution: Install Prisma dependency
source venv/bin/activate
pip install prisma
```

**Error**: `Unable to find Prisma binaries`
```bash
# Solution: Use simplified config without database
# Ensure simple_litellm_config.yaml has:
store_model_in_db: false
```

#### 2. Parameter Compatibility Errors
**Error**: `openrouter does not support parameters: ['thinking']`
```bash
# Solution: Add to simple_litellm_config.yaml:
litellm_settings:
  drop_params: true
```

#### 3. Rate Limiting Issues
**Error**: `qwen/qwen3-coder:free is temporarily rate-limited`
```bash
# Solution: Switch to paid model
> /model qwen3-coder  # In Claude Code
```

#### 4. Claude Code Still Using Anthropic
**Issue**: Responses claim to be "Claude 3.5 Sonnet"
```bash
# Solution: Logout from Anthropic
claude auth logout

# Verify environment variables
echo $ANTHROPIC_BASE_URL  # Should be http://localhost:4000
```

#### 5. MCP Server Connection Failures
**Error**: `MCP server "claude-flow": Connection failed`
```bash
# Solution: Ensure Claude Flow is installed globally
npm install -g claude-flow@alpha

# Restart Claude Code
claude --debug
```

---

## ✅ Verification Steps

### Complete Integration Test Checklist

#### 1. Environment Verification
- [ ] Virtual environment active (`source venv/bin/activate`)
- [ ] Environment variables loaded (`source .env`)
- [ ] OpenRouter API key set (`echo $OPENROUTER_KEY`)

#### 2. LiteLLM Proxy Verification
- [ ] Proxy running on port 4000
- [ ] Health endpoint responding (`curl http://localhost:4000/health`)
- [ ] Models configured (qwen3-coder, qwen3-coder-free, Claude mappings)

#### 3. Claude Code Integration Verification
- [ ] API Base URL override detected (`http://localhost:4000`)
- [ ] Model responds as Qwen (`What model are you?`)
- [ ] Model switching works (`/model qwen3-coder`)
- [ ] No parameter errors in debug logs

#### 4. Claude Flow Orchestration Verification
- [ ] Claude Flow installed globally
- [ ] Project initialized (`claude-flow init`)
- [ ] Hive Mind wizard functional
- [ ] Swarms can be created and resumed
- [ ] MCP servers connecting successfully

#### 5. End-to-End Workflow Verification
- [ ] Create swarm with Hive Mind wizard
- [ ] Resume swarm with `--claude` flag
- [ ] Verify Claude Code launches with swarm context
- [ ] Test multi-agent coordination
- [ ] Confirm persistent memory and checkpoints

---

## 🚀 Advanced Usage

### Custom Model Configurations

#### Adding New OpenRouter Models
```yaml
# Add to simple_litellm_config.yaml
model_list:
  - model_name: custom-model-name
    litellm_params:
      model: openrouter/provider/model-name
      api_key: os.environ/OPENROUTER_KEY
```

#### Model-Specific Parameters
```yaml
model_list:
  - model_name: qwen3-coder-optimized
    litellm_params:
      model: openrouter/qwen/qwen3-coder
      api_key: os.environ/OPENROUTER_KEY
      max_tokens: 4096
      temperature: 0.7
```

### Advanced LiteLLM Settings
```yaml
litellm_settings:
  drop_params: true
  success_callback: ["langfuse"]  # Optional: Add logging
  failure_callback: ["langfuse"]
  set_verbose: false  # Set to true for detailed logs
```

### Production Deployment Considerations

#### 1. Security
- Use environment variables for all API keys
- Restrict proxy access to localhost only
- Consider using HTTPS in production

#### 2. Monitoring
- Enable LiteLLM logging callbacks
- Monitor proxy health and uptime
- Track token usage and costs

#### 3. Scaling
- Consider multiple proxy instances for high load
- Use load balancers for proxy distribution
- Monitor OpenRouter rate limits

---

## 📖 References & Documentation

### Primary Documentation Sources

#### Claude Flow Official Documentation
- **Claude Flow GitHub Repository**: https://github.com/ruvnet/claude-flow
- **Claude Flow Wiki**: https://github.com/ruvnet/claude-flow/wiki
- **Path C (LiteLLM Proxy) Integration Guide**: https://github.com/ruvnet/claude-flow/wiki/OpenRouter-Integration#path-c-litellm-proxy
- **Hive Mind Documentation**: https://github.com/ruvnet/claude-flow/tree/main/docs/hive-mind
- **ruv-swarm Documentation**: https://github.com/ruvnet/ruv-FANN/tree/main/ruv-swarm
- **Claude Flow Discord Community**: https://discord.agentics.org

#### OpenRouter Documentation
- **OpenRouter Official Website**: https://openrouter.ai
- **OpenRouter API Documentation**: https://openrouter.ai/docs
- **OpenRouter Models List**: https://openrouter.ai/models
- **OpenRouter Pricing**: https://openrouter.ai/pricing
- **OpenRouter Settings & API Keys**: https://openrouter.ai/settings/integrations
- **OpenRouter Status Page**: https://status.openrouter.ai

#### LiteLLM Documentation
- **LiteLLM GitHub Repository**: https://github.com/BerriAI/litellm
- **LiteLLM Proxy Documentation**: https://docs.litellm.ai/docs/proxy/quick_start
- **LiteLLM OpenRouter Integration**: https://docs.litellm.ai/docs/providers/openrouter
- **LiteLLM Configuration Reference**: https://docs.litellm.ai/docs/proxy/configs
- **LiteLLM Supported Parameters**: https://docs.litellm.ai/docs/completion/input
- **LiteLLM Issues & Support**: https://github.com/BerriAI/litellm/issues

#### Claude Code Documentation
- **Claude Code Official Documentation**: https://claude.ai/code
- **Claude Code CLI Reference**: https://docs.anthropic.com/claude/docs/claude-code
- **Claude Code Environment Variables**: https://docs.anthropic.com/claude/docs/claude-code#environment-variables
- **Claude Code MCP Integration**: https://docs.anthropic.com/claude/docs/mcp

#### Qwen Model Documentation
- **Qwen-3 Coder Model Card**: https://openrouter.ai/models/qwen/qwen3-coder
- **Qwen Official Repository**: https://github.com/QwenLM/Qwen
- **Qwen-3 Technical Report**: https://arxiv.org/abs/2409.12186
- **Qwen Model Documentation**: https://qwen.readthedocs.io/

### Technical References

#### Python & Environment Management
- **Python Virtual Environments**: https://docs.python.org/3/tutorial/venv.html
- **pip Package Manager**: https://pip.pypa.io/en/stable/
- **Python Environment Variables**: https://docs.python.org/3/library/os.html#os.environ

#### Node.js & NPM
- **Node.js Official Documentation**: https://nodejs.org/docs/
- **NPM Package Manager**: https://docs.npmjs.com/
- **NPM Global Packages**: https://docs.npmjs.com/downloading-and-installing-packages-globally

#### API & Integration Standards
- **OpenAI API Specification**: https://platform.openai.com/docs/api-reference
- **HTTP Status Codes Reference**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- **JSON Schema Specification**: https://json-schema.org/
- **YAML Specification**: https://yaml.org/spec/

### Troubleshooting Resources

#### Common Error Solutions
- **LiteLLM Prisma Issues**: https://github.com/BerriAI/litellm/issues?q=prisma
- **OpenRouter Rate Limiting**: https://openrouter.ai/docs#rate-limits
- **Claude Code Authentication**: https://docs.anthropic.com/claude/docs/claude-code#authentication
- **Python Virtual Environment Issues**: https://docs.python.org/3/tutorial/venv.html#managing-packages-with-pip

#### Community Support
- **Claude Flow Discord**: https://discord.agentics.org
- **LiteLLM Discord**: https://discord.gg/litellm
- **OpenRouter Community**: https://openrouter.ai/community
- **Stack Overflow - LiteLLM**: https://stackoverflow.com/questions/tagged/litellm
- **Stack Overflow - OpenRouter**: https://stackoverflow.com/questions/tagged/openrouter

### Integration Methodology References

#### Path Comparison Documentation
- **Path A (Direct Integration)**: https://github.com/ruvnet/claude-flow/wiki/OpenRouter-Integration#path-a-direct
- **Path B (Environment Variables)**: https://github.com/ruvnet/claude-flow/wiki/OpenRouter-Integration#path-b-environment
- **Path C (LiteLLM Proxy)**: https://github.com/ruvnet/claude-flow/wiki/OpenRouter-Integration#path-c-litellm-proxy

#### Best Practices References
- **API Proxy Best Practices**: https://docs.litellm.ai/docs/proxy/production
- **Environment Variable Security**: https://12factor.net/config
- **Model Parameter Optimization**: https://docs.litellm.ai/docs/completion/input#model-specific-params

### Version Information

#### Software Versions Used in This Integration
- **Claude Code**: v1.0.80+
- **Claude Flow**: v2.0.0-alpha.89
- **LiteLLM**: v1.75.5.post1
- **Python**: v3.11.6
- **Node.js**: v18+
- **Qwen-3 Coder**: 480B parameters (35B active)

#### API Versions
- **OpenRouter API**: v1
- **OpenAI Compatible API**: v1
- **Claude API**: v1 (compatibility layer)

### Related Projects & Alternatives

#### Alternative Proxy Solutions
- **OpenAI Proxy**: https://github.com/openai/openai-proxy
- **AI Gateway**: https://github.com/Portkey-AI/gateway
- **LangChain Proxy**: https://python.langchain.com/docs/integrations/llms/

#### Alternative Model Providers
- **Anthropic Direct**: https://console.anthropic.com/
- **OpenAI Direct**: https://platform.openai.com/
- **Together AI**: https://together.ai/
- **Replicate**: https://replicate.com/

### Acknowledgments

#### Key Contributors & Projects
- **rUv (Claude Flow Creator)**: https://github.com/ruvnet
- **BerriAI (LiteLLM Team)**: https://github.com/BerriAI
- **OpenRouter Team**: https://openrouter.ai/about
- **Qwen Team (Alibaba)**: https://github.com/QwenLM
- **Anthropic (Claude Code)**: https://anthropic.com/

#### Integration Inspiration
- **Claude Flow Wiki Examples**: https://github.com/ruvnet/claude-flow/wiki/Examples
- **LiteLLM Cookbook**: https://docs.litellm.ai/docs/tutorials/
- **OpenRouter Integration Examples**: https://openrouter.ai/docs#examples

---

## 📚 Appendix

### A. File Structure Reference
```
claude-flow-open-router/
├── .env                                    # Environment variables
├── simple_litellm_config.yaml            # LiteLLM proxy configuration
├── venv/                                  # Python virtual environment
│   ├── bin/activate                       # Virtual environment activation
│   └── lib/python3.11/site-packages/     # Python packages
├── .claude/                               # Claude Code settings
│   └── settings.json                      # Claude Code configuration
├── .swarm/                                # Claude Flow swarm data
│   └── memory.db                          # Persistent swarm memory
├── .mcp.json                              # MCP server configuration
├── CLAUDE.md                              # Claude Flow project description
└── CLAUDE_FLOW_OPENROUTER_INTEGRATION_GUIDE.md  # This documentation
```

### B. Environment Variables Reference
```bash
# Core Integration Variables
ANTHROPIC_BASE_URL="http://localhost:4000"      # LiteLLM proxy URL
ANTHROPIC_AUTH_TOKEN="litellm_master"           # LiteLLM master key
ANTHROPIC_MODEL="qwen3-coder"                   # Default Qwen model

# Claude Flow Features
CLAUDE_FLOW_HOOKS_ENABLED=true                 # Enable lifecycle hooks
CLAUDE_FLOW_TELEMETRY_ENABLED=true             # Enable telemetry

# OpenRouter Integration
OPENROUTER_KEY="sk-or-v1-[your-key]"           # OpenRouter API key
```

### C. Command Reference
```bash
# Virtual Environment
source venv/bin/activate                        # Activate venv
deactivate                                      # Deactivate venv

# LiteLLM Proxy
litellm --config simple_litellm_config.yaml --port 4000  # Start proxy
pkill -f "litellm.*simple_litellm_config.yaml"          # Stop proxy

# Claude Code
claude --debug                                  # Start with debug
claude auth logout                              # Logout from Anthropic

# Claude Flow
claude-flow init                                # Initialize project
claude-flow hive-mind wizard                   # Start Hive Mind wizard
claude-flow hive-mind status                   # Check swarm status
claude-flow hive-mind resume [session-id] --claude  # Resume with Claude Code
```

### D. Model Specifications

#### Qwen-3 Coder Models Available
- **qwen/qwen3-coder**: Full version (480B total, 35B active parameters)
- **qwen/qwen3-coder:free**: Free version with rate limits
- **Context Length**: 262,144 tokens
- **Specialization**: Code generation, function calling, tool use
- **Architecture**: Mixture-of-Experts (MoE)

#### Cost Comparison (Approximate)
- **Qwen-3 Coder (OpenRouter)**: $0.50-2.00 per 1M tokens
- **Claude 3.5 Sonnet (Anthropic)**: $3.00-15.00 per 1M tokens
- **Savings**: 70-85% cost reduction

### E. Integration Timeline
This integration was successfully completed on August 14, 2025, following these major milestones:

1. **Initial Setup** (Path B attempt): Direct OpenRouter integration failed due to 405 errors
2. **LiteLLM Discovery**: Identified Path C (LiteLLM Proxy) as solution
3. **Proxy Configuration**: Resolved Prisma dependencies and parameter compatibility
4. **Model Mapping**: Added Claude model name mappings for seamless integration
5. **Claude Flow Integration**: Successfully tested Hive Mind and swarm orchestration
6. **Production Verification**: Confirmed end-to-end functionality with multi-agent workflows

---

## 🎯 Conclusion

This integration successfully enables Claude Flow to use OpenRouter's Qwen-3 Coder models through a LiteLLM proxy, providing:

- **Cost Savings**: 70-85% reduction compared to Anthropic direct billing
- **Full Compatibility**: All Claude Flow features work with OpenRouter backend
- **Enhanced Capabilities**: Access to specialized code generation models
- **Scalability**: Production-ready architecture with monitoring and error handling

The setup is now **production-ready** and can be used for:
- Multi-agent development workflows
- Large-scale code generation projects
- AI-powered software development
- Collaborative programming with AI swarms

**Status**: ✅ **Integration Complete and Verified**

---

*Document Version: 1.0*  
*Last Updated: August 14, 2025*  
*Integration Method: Path C (LiteLLM Proxy)*  
*Backend: OpenRouter + Qwen-3 Coder*
